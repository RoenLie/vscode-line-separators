/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import {
	window, ThemeColor, TextEditor, Range, TextEditorDecorationType,
	DecorationRenderOptions, DocumentSymbol, workspace
} from "vscode";
import { DEFAULT_GREENISH_COLOR } from "./constants";
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

		const lineText = lineRangeTextTrimmed( new Range( lineToCheck, 0, lineToCheck, checkLength ) );
		if ( lineText ) {
			const lines = getContentUpwardsUntilBlankLine( new Range( lineToCheck, 0, lineToCheck, checkLength ) );

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

		let freeLines = countEmptyLinesUpwards( new Range( lineToCheck, 0, lineToCheck, checkLength ) );
		if ( freeLines < minimumFreespace )
			continue;

		//freeLines = Math.max( 2, Math.ceil( freeLines / 2 ) );
		freeLines = minimumFreespace;

		const desiredRange = new Range(
			element.range.start.line - paddingLines - freeLines, 0,
			element.range.start.line - paddingLines - freeLines, 0
		);

		ranges.push( desiredRange );
	}

	activeEditor.setDecorations( decorationType, ranges );
};


const lineRangeTextTrimmed = ( range: Range ) => {
	return window.activeTextEditor.document.getText( range ).replace( / |\t/g, '' );
};


const EXPR_MULTILINE_COMMENT = /\/\*.*\*\//;
const EXPR_SINGLELINE_COMMENT = /\/\/.*/;
const EXPR_REGION_COMMENT = /#region/;


const getContentUpwardsUntilBlankLine = ( range: Range, checkLength = 50 ) => {
	const lines: string[] = [];

	let lineToCheck = range.start.line;
	let lineText = lineRangeTextTrimmed( new Range( lineToCheck, 0, lineToCheck, checkLength ) );

	while ( lineToCheck > 0 && lineText ) {
		lines.push( lineText );
		lineToCheck--;
		lineText = lineRangeTextTrimmed( new Range( lineToCheck, 0, lineToCheck, checkLength ) );
	}

	return lines;
};


const countEmptyLinesUpwards = ( range: Range, checkLength = 50 ) => {
	let emptyLines = 0;

	let lineToCheck = range.start.line;
	let lineText = lineRangeTextTrimmed( new Range( lineToCheck, 0, lineToCheck, checkLength ) );

	while ( lineToCheck >= 0 && !lineText ) {
		emptyLines++;
		lineToCheck--;
		lineText = lineRangeTextTrimmed( new Range( lineToCheck, 0, lineToCheck, checkLength ) );
	}

	return emptyLines;
};