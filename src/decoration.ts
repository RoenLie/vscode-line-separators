import {
	window, ThemeColor, TextEditor, Range, TextEditorDecorationType,
	DecorationRenderOptions, DocumentSymbol, workspace
} from "vscode";
import { DEFAULT_GREENISH_COLOR, EXPR_MULTILINE_COMMENT, EXPR_REGION_COMMENT, EXPR_SINGLELINE_COMMENT } from "./constants";
import { CustomDocumentSymbol } from './symbols.js';


export const createTopLineDecoration = (
	borderColor: string | ThemeColor,
	borderWidth: string,
	borderStyle: string
): TextEditorDecorationType => {
	const decorationOptions: DecorationRenderOptions = {
		isWholeLine: true,
		borderWidth: `0 0 ${ borderWidth } 0`,
		borderStyle: `${ borderStyle }`,
		borderColor: borderColor,
	};

	return window.createTextEditorDecorationType( decorationOptions );
};


const useOriginalGreenishSeparator = ( symbolKind: string ): boolean => {
	if ( ![ "methods", "functions", "constructors" ].includes( symbolKind ) )
		return false;

	return workspace.getConfiguration( "separators" ).get( "useOriginalGreenishSeparator", false );
};


const getBorderColor = ( symbolKind: string ): string | ThemeColor => {
	if ( useOriginalGreenishSeparator( symbolKind ) )
		return DEFAULT_GREENISH_COLOR;

	return new ThemeColor( `separators.${ symbolKind }.borderColor` );
};


export const createTextEditorDecoration = ( symbolKind: string ): TextEditorDecorationType => {
	const borderColor = getBorderColor( symbolKind );
	const borderWidth = workspace.getConfiguration( "separators" ).get( `${ symbolKind }.borderWidth`, 1 );
	const borderStyle = workspace.getConfiguration( "separators" ).get( `${ symbolKind }.borderStyle`, "solid" );

	return createTopLineDecoration( borderColor, `${ borderWidth }px`, borderStyle );
};


export const updateDecorationsInActiveEditor = (
	activeEditor: TextEditor | undefined,
	symbols: DocumentSymbol[] | CustomDocumentSymbol[] | undefined,
	decorationType: TextEditorDecorationType,
	minimumFreespace: number,
) => {
	if ( !activeEditor )
		return;

	if ( !symbols ) {
		const bks: Range[] = [];
		activeEditor.setDecorations( decorationType, bks );
		return;
	}

	const checkLength = 50;
	const ranges: Range[] = [];

	for ( const element of symbols ) {
		let lineToCheck = element.range.start.line - 1;
		let paddingLines = 0;

		const lineText = lineRangeTextTrimmed( lineToCheck, checkLength );
		if ( lineText ) {
			const lines = getContentUpwardsUntilBlankLine( lineToCheck, checkLength );

			const isSingleComments = lines.every( line => EXPR_SINGLELINE_COMMENT.test( line ) );
			const isMultilineComment = EXPR_MULTILINE_COMMENT.test( lines.join( ' ' ) );
			const isRegionComment = lines.some( line => EXPR_REGION_COMMENT.test( line ) );

			if ( !isRegionComment && ( isSingleComments || isMultilineComment ) ) {
				paddingLines = lines.length;
				lineToCheck = lineToCheck - paddingLines;
			} else {
				continue;
			}
		}

		const freeLines = countEmptyLinesUpwards( lineToCheck, checkLength );
		if ( freeLines < minimumFreespace )
			continue;

		const lineNumber = Math.max( 0, element.range.start.line - paddingLines - minimumFreespace );
		const desiredRange = new Range( lineNumber, 0, lineNumber, 0 );

		ranges.push( desiredRange );
	}

	activeEditor.setDecorations( decorationType, ranges );
};


const DEFAULT_LINE_CHECK_LENGTH = 300;


const lineRangeTextTrimmed = ( linenr: number, checkLength = DEFAULT_LINE_CHECK_LENGTH ) => {
	linenr = Math.max( 0, linenr );
	const range = new Range( linenr, 0, linenr, checkLength );

	return window.activeTextEditor.document.getText( range ).replace( / |\t/g, '' );
};


const getContentUpwardsUntilBlankLine = ( linenr: number, checkLength = DEFAULT_LINE_CHECK_LENGTH ) => {
	linenr = Math.max( 0, linenr );
	const lines: string[] = [];

	let lineToCheck = linenr;
	let lineText = lineRangeTextTrimmed( lineToCheck, checkLength );

	while ( lineToCheck > 0 && lineText ) {
		lines.unshift( lineText );
		lineToCheck--;
		lineText = lineRangeTextTrimmed( lineToCheck, checkLength );
	}

	return lines;
};


const countEmptyLinesUpwards = ( linenr: number, checkLength = DEFAULT_LINE_CHECK_LENGTH ) => {
	linenr = Math.max( 0, linenr );
	let emptyLines = 0;

	let lineToCheck = linenr;
	let lineText = lineRangeTextTrimmed( lineToCheck, checkLength );

	while ( lineToCheck >= 0 && !lineText ) {
		emptyLines++;
		lineToCheck--;
		lineText = lineRangeTextTrimmed( lineToCheck, checkLength );
	}

	return emptyLines;
};