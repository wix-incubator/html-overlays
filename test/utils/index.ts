export const combineCSSNot = (notMatches: string[]) => notMatches.map(match => `:not(${match})`).join('');
