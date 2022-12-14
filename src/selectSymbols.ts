import { QuickPickItem, SymbolKind, window, workspace } from "vscode";
import { areEquivalent } from "./array";
import { DEFAULT_ENABLED_SYMBOLS } from "./constants";
import { CustomDocumentSymbol } from './symbols.js';

export async function showSelectSymbolsQuickPick( selectedSymbols: string[] ): Promise<string[] | undefined> {
	const allSymbols: QuickPickItem[] = [];
	allSymbols.push( {
		label: "Classes",
		picked: selectedSymbols.includes( "Classes" )
	} );
	allSymbols.push( {
		label: "Constructors",
		picked: selectedSymbols.includes( "Constructors" )
	} );
	allSymbols.push( {
		label: "Enums",
		picked: selectedSymbols.includes( "Enums" )
	} );
	allSymbols.push( {
		label: "Functions",
		picked: selectedSymbols.includes( "Functions" )
	} );
	allSymbols.push( {
		label: "Interfaces",
		picked: selectedSymbols.includes( "Interfaces" )
	} );
	allSymbols.push( {
		label: "Methods",
		picked: selectedSymbols.includes( "Methods" )
	} );
	allSymbols.push( {
		label: "Namespaces",
		picked: selectedSymbols.includes( "Namespaces" )
	} );
	allSymbols.push( {
		label: "Structs",
		picked: selectedSymbols.includes( "Structs" )
	} );
	allSymbols.push( {
		label: "Variables",
		picked: selectedSymbols.includes( "Variables" )
	} );
	allSymbols.push( {
		label: "Modules",
		picked: selectedSymbols.includes( "Modules" )
	} );
	allSymbols.push( {
		label: "Properties",
		picked: selectedSymbols.includes( "Properties" )
	} );

	const picked = await window.showQuickPick( allSymbols, {
		placeHolder: "Select which symbols should have separators",
		canPickMany: true
	} );

	if ( !picked )
		return undefined;
	if ( picked.length === 0 )
		return [];

	return picked?.map( item => item.label );
}



export const selectSymbols = async (): Promise<boolean> => {
	const selected = workspace
		.getConfiguration( "separators", window.activeTextEditor?.document )
		.get( "enabledSymbols", DEFAULT_ENABLED_SYMBOLS );

	const pick = await showSelectSymbolsQuickPick( selected );

	if ( !pick )
		return false;
	if ( areEquivalent( pick, selected ) )
		return false;

	workspace.getConfiguration( "separators" ).update( "enabledSymbols", pick );

	return true;
};


export const getSymbolKindAsKind = ( kind: string ): SymbolKind => {
	switch ( kind ) {
		case "Methods":
			return SymbolKind.Method;
		case "Functions":
			return SymbolKind.Function;
		case "Constructors":
			return SymbolKind.Constructor;
		case "Classes":
			return SymbolKind.Class;
		case "Interfaces":
			return SymbolKind.Interface;
		case "Enums":
			return SymbolKind.Enum;
		case "Namespaces":
			return SymbolKind.Namespace;
		case "Structs":
			return SymbolKind.Struct;
		case "Variables":
			return SymbolKind.Variable;
		case "Modules":
			return SymbolKind.Module;
		case "Properties":
			return SymbolKind.Property;

		default:
			return SymbolKind.Object;
	}
};

export const getEnabledSymbols = (): SymbolKind[] => {
	const symbols = workspace
		.getConfiguration( "separators", window.activeTextEditor?.document )
		.get( "enabledSymbols", DEFAULT_ENABLED_SYMBOLS );

	return symbols.map( symbol => getSymbolKindAsKind( symbol ) );
};

export const getCustomEnabledSymbols = (): string[] => {
	const symbols = workspace
		.getConfiguration( "separators", window.activeTextEditor?.document )
		.get( "enabledCustomSymbols", [] );

	return symbols;
};