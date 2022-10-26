import { commands, DocumentSymbol, Range, SymbolKind, TextDocument, window, workspace } from "vscode";
import { LanguageFactory } from "./language/factory";


const getSymbolsFrom = ( symbol: DocumentSymbol, level: number ): DocumentSymbol[] => {
	const maxDepth: number = workspace
		.getConfiguration( "separators", window.activeTextEditor?.document )
		.get( "maxDepth", 0 );

	if ( maxDepth !== 0 && level >= maxDepth )
		return [ symbol ];

	if ( symbol.children.length === 0 )
		return [ symbol ];

	level++;
	const symbols: DocumentSymbol[] = [ symbol ];

	for ( const children of symbol.children ) {
		if ( children.children.length === 0 )
			symbols.push( children );
		else
			symbols.push( ...getSymbolsFrom( children, level ) );
	}

	return symbols;
};


const shouldIgnore = ( symbol: DocumentSymbol, textDocument: TextDocument | undefined ): boolean => {
	if ( symbol.kind !== SymbolKind.Function )
		return false;

	if ( !workspace.getConfiguration( "separators", textDocument ).get( "functions.ignoreCallbackInline", false ) )
		return false;

	const language = LanguageFactory.getLanguage( <string> textDocument?.languageId );
	if ( !language )
		return false;

	return language?.isCallback( symbol );
};


export const findSymbols = async (
	symbolsToFind: SymbolKind[],
	findRegions: boolean
): Promise<[ docSymbols: DocumentSymbol[], customSymbols: CustomDocumentSymbol[] ]> => {
	let docSymbols: DocumentSymbol[] = [];
	let customSymbols: CustomDocumentSymbol[] = [];

	if ( !window.activeTextEditor )
		return [ docSymbols, customSymbols ];

	docSymbols = await documentSymbolProvider( symbolsToFind );

	if ( findRegions )
		customSymbols = customDocumentSymbolProvider();

	return [ docSymbols, customSymbols ];
};


const documentSymbolProvider = async ( symbolsToFind: SymbolKind[] ) => {
	let docSymbols = await commands.executeCommand(
		'vscode.executeDocumentSymbolProvider',
		window.activeTextEditor.document.uri
	) as DocumentSymbol[] ?? [];

	const level = 1;
	const symbols: DocumentSymbol[] = [];

	for ( const symbol of docSymbols )
		symbols.push( ...getSymbolsFrom( symbol, level ) );

	docSymbols = symbols.filter(
		symbol => symbolsToFind.includes( symbol.kind ) &&
			!shouldIgnore( symbol, window.activeTextEditor?.document )
	);

	return docSymbols;
};


export interface CustomDocumentSymbol {
	name: string;
	range: Range;
}


const customDocumentSymbolProvider = () => {
	const editor = window.activeTextEditor;
	const findValue = '#region';

	const foundRegions: CustomDocumentSymbol[] = [];

	// get all the matches in the document
	const fullText = editor.document.getText();
	const matches = [ ...fullText.matchAll( new RegExp( findValue, "gm" ) ) ];

	matches.forEach( ( match ) => {
		const startPos = editor.document.positionAt( match.index );
		const endPos = editor.document.positionAt( match.index + match[ 0 ].length );
		foundRegions.push( {
			name: 'region',
			range: new Range( startPos, endPos )
		} );
	} );

	return foundRegions;
};