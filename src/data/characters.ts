export type Character = {
  id: string;
  name: string;
  asset: any; // require path or uri
  description?: string;
};

// The project assets/mascots/head contains character images named as victim-1.png etc.

// Try a few likely asset paths. Replace with correct filenames if necessary.
let a1, a2, a3;
a1 = require('../assets/mascots/victim1.png');
a2 = require('../assets/mascots/victim2.png');
a3 = require('../assets/mascots/victim3.png');

export const CHARACTERS: Character[] = [
  { id: 'victim-1', name: 'Victim', asset: a1 },
  { id: 'victim-2', name: 'Victim 2', asset: a2 },
  { id: 'victim-3', name: 'Victim 3', asset: a3 },
];

export default CHARACTERS;
