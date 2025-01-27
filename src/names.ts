export const names: Array<string> = [
  "Sir Reginald Beef", "Baron von Floop", 
  "Countess Calamity", "Lord Fluffybottom", 
  "Duke of Dingdong", "Princess Pottymouth", 
  "King Bartholomew the Bold", "Queen of Quibbles", 
  "Sir Reginald the Red", "Lady Lavender Lace", 
  "Lord Fluffykins the Third", "Baron von Bleep", 
  "Countess Calamity Jane", "Duke of Dunder Mifflin", 
  "Princess Penelope Plum", "King Konga", 
  "Queen of the Quagmire", "Sir Reginald the Ridiculous", 
  "Lady Lavender the Loud", "Lord Fluffybottom the Fourth", 
  "Baron von Blunder", "Countess Calamity Cakes", 
  "Duke of Ding-a-Ling", "Princess Penelope Puff", 
  "King Konga the Great", "Queen of the Quibble", 
  "Sir Magnificent", "Lady Lavender Lacewing", 
  "Lord Fluffykins the Fifth", "Baron von Bungle", 
  "Countess Calamity Cookie", "Duke of Dunderhead", 
  "Princess Penelope Pickle", "King Konga the Conquerer", 
  "Queen of the Quirks", "Sir Reginald the Rambunctious", 
  "Lady Lavender the Lazy", "Lord Fluffybottom the Sixth", 
  "Baron von Blunderbuss", "Countess Calamity Cat", 
  "Duke of Dunderpate", "Princess Penelope Pancake", 
  "King Konga the Kind", "Queen of the Quacks", 
  "Sir Reginald the Ridiculous", "Lady Lavender the Loquacious", 
  "Lord Fluffybottom the Seventh", "Baron von Blunderbore", 
  "Countess Calamity Cake", "Duke of Dunderhead", 
  "Princess Penelope Pickle", "King Konga the Kind", 
  "Queen of the Quacks"
];

export function getRandomName(): string {
  const index = Math.floor(Math.random()*names.length);
  return names[index];
}