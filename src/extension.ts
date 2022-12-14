// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { DEFAULT_ENABLED_SYMBOLS } from './constants';
import { Container } from './container';
import { createTextEditorDecoration, createTopLineDecoration, updateDecorationsInActiveEditor } from './decoration';
import { devExample } from './dev-example-text';
import { getCustomEnabledSymbols, getEnabledSymbols, getSymbolKindAsKind, selectSymbols } from './selectSymbols';
import { CustomDocumentSymbol, findSymbols } from './symbols';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export const activate = async ( context: vscode.ExtensionContext ) => {
	Container.context = context;

	let timeout: NodeJS.Timer;
	const symbolsDecorationsType = new Map<string, vscode.TextEditorDecorationType>();
	let activeEditor = vscode.window.activeTextEditor;
	let minimumFreespace = vscode.workspace
		.getConfiguration( "separators", vscode.window.activeTextEditor?.document )
		.get( "minEmptyLines", 2 );

	// Evaluate (prepare the list) and DRAW
	const updateDecorations = async () => {
		let symbols: vscode.DocumentSymbol[] = [];
		let customSymbols: CustomDocumentSymbol[] = [];

		if ( isVisible ) {
			const selectedSymbols = getEnabledSymbols();
			const selectedCustomSymbols = getCustomEnabledSymbols();

			const [ docSymbols = [], customDocSymbols = [] ] = await findSymbols(
				selectedSymbols,
				selectedCustomSymbols.includes( 'regions' )
			);

			symbols = docSymbols;
			customSymbols = customDocSymbols;
		}

		for ( const symbol of DEFAULT_ENABLED_SYMBOLS ) {
			updateDecorationsInActiveEditor(
				vscode.window.activeTextEditor,
				symbols.filter( s => s.kind === getSymbolKindAsKind( symbol ) ),
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				symbolsDecorationsType.get( symbol.toLocaleLowerCase() )!,
				minimumFreespace
			);
		}

		updateDecorationsInActiveEditor(
			vscode.window.activeTextEditor,
			customSymbols,
			symbolsDecorationsType.get( 'regions' ),
			minimumFreespace
		);
	};

	const triggerUpdateDecorations = () => {
		timeout && clearTimeout( timeout );
		timeout = setTimeout( updateDecorations, 500 ) as unknown as NodeJS.Timer;
	};

	const createDecorations = () => {
		symbolsDecorationsType.set( "methods", createTextEditorDecoration( "methods" ) );
		symbolsDecorationsType.set( "functions", createTextEditorDecoration( "functions" ) );
		symbolsDecorationsType.set( "constructors", createTextEditorDecoration( "constructors" ) );
		symbolsDecorationsType.set( "classes", createTextEditorDecoration( "classes" ) );
		symbolsDecorationsType.set( "interfaces", createTextEditorDecoration( "interfaces" ) );
		symbolsDecorationsType.set( "enums", createTextEditorDecoration( "enums" ) );
		symbolsDecorationsType.set( "namespaces", createTextEditorDecoration( "namespaces" ) );
		symbolsDecorationsType.set( "structs", createTextEditorDecoration( "structs" ) );
		symbolsDecorationsType.set( "variables", createTextEditorDecoration( "variables" ) );
		symbolsDecorationsType.set( "modules", createTextEditorDecoration( "modules" ) );
		symbolsDecorationsType.set( "properties", createTextEditorDecoration( "properties" ) );
		symbolsDecorationsType.set( "regions", createTopLineDecoration( 'hotpink', `1px`, 'solid' ) );
	};

	createDecorations();

	// DEMO DATA
	//devExample( activeEditor );

	let isVisible = context.workspaceState.get<boolean>( 'separators.visible', true );

	if ( activeEditor )
		triggerUpdateDecorations();

	vscode.window.onDidChangeActiveTextEditor(
		editor => {
			if ( editor ) {
				activeEditor = editor;
				triggerUpdateDecorations();
			}
		},
		null, context.subscriptions
	);

	vscode.workspace.onDidChangeTextDocument(
		event => {
			if ( event.contentChanges.length === 0 )
				return;
			if ( activeEditor && event.document === activeEditor.document )
				updateDecorations();
		},
		null, context.subscriptions
	);

	context.subscriptions.push( vscode.workspace.onDidChangeConfiguration( cfg => {
		if ( cfg.affectsConfiguration( "separators" ) ) {
			minimumFreespace = vscode.workspace
				.getConfiguration( "separators", vscode.window.activeTextEditor?.document )
				.get( "minEmptyLines", 2 );

			symbolsDecorationsType.forEach( ( value ) => value.dispose() );
			createDecorations();
			updateDecorations();
		}
	} ) );

	const toggleVisibility = () => {
		isVisible = !isVisible;
		context.workspaceState.update( 'separators.visible', isVisible );
		updateDecorations();
	};

	vscode.commands.registerCommand( "separators.toggleVisibility", () => toggleVisibility() );
	vscode.commands.registerCommand( "separators.selectSymbols", async () => await selectSymbols() && updateDecorations() );
};
