export const areEquivalent = ( array1: string[], array2: string[] ): boolean => {
	if ( !array1 || !array2 )
		return false;

	if ( array1.length !== array2.length )
		return false;

	return array1.sort().join( "," ) === array2.sort().join( "," );
};