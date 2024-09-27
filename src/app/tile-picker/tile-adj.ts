
export enum AdjType {

}


/**
- peaks have a minimum of 2 tiles
- slope is max 45 degrees
--> only 6 tiles needed!
--> optional decoration tiles on surface (probability per tile)

right/left corner
000  000
1X0  0X1

flat
000
111

right/left inside corner
110  011
1X1  1X1

inside
111
1X1

*/