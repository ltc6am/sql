/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TableData {
  columns: string[];
  values: any[][];
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Level {
  id: number;
  title: string;
  difficulty: Difficulty;
  scenario: string;
  description: string;
  hint: string;
  initialSql: string;
  expectedResult: (data: TableData) => boolean;
  setupSql: string;
  tables: string[];
}

export const LEVELS: Level[] = [
  // 1-5: SELECT FROM
  {
    id: 1, difficulty: 'Easy', title: "The Scroll of Names",
    scenario: "The village elder needs a list of all adventurer names and their classes.",
    description: "Select 'name' and 'class' from the 'adventurers' table.",
    hint: "SELECT name, class FROM adventurers;", initialSql: "SELECT * FROM adventurers;",
    setupSql: "CREATE TABLE adventurers (id INT, name TEXT, class TEXT); INSERT INTO adventurers VALUES (1, 'Alaric', 'Warrior'), (2, 'Sola', 'Mage');",
    tables: ['adventurers'], expectedResult: (data) => data.columns.length === 2 && data.values.length === 2
  },
  {
    id: 2, difficulty: 'Easy', title: "Library Audit",
    scenario: "A historian wants to see the titles of all books in the forbidden section.",
    description: "Select 'title' from the 'books' table.",
    hint: "SELECT title FROM books;", initialSql: "SELECT * FROM books;",
    setupSql: "CREATE TABLE books (id INT, title TEXT, author TEXT); INSERT INTO books VALUES (1, 'Necronomicon', 'Unknown'), (2, 'The Void', 'Erasmus');",
    tables: ['books'], expectedResult: (data) => data.columns.length === 1 && data.values.length === 2
  },
  {
    id: 3, difficulty: 'Easy', title: "Potion Inventory",
    scenario: "The alchemist needs to check the 'name' and 'stock' of every potion.",
    description: "Select 'name' and 'stock' from the 'potions' table.",
    hint: "SELECT name, stock FROM potions;", initialSql: "SELECT * FROM potions;",
    setupSql: "CREATE TABLE potions (id INT, name TEXT, stock INT); INSERT INTO potions VALUES (1, 'Health Potion', 50), (2, 'Mana Potion', 30);",
    tables: ['potions'], expectedResult: (data) => data.columns.length === 2 && data.values.length === 2
  },
  {
    id: 4, difficulty: 'Easy', title: "Gate Log",
    scenario: "The guard wants to see every record of who passed through the gate.",
    description: "Select all columns from the 'log' table.",
    hint: "SELECT * FROM log;", initialSql: "SELECT name FROM log;",
    setupSql: "CREATE TABLE log (id INT, name TEXT, direction TEXT, time TEXT); INSERT INTO log VALUES (1, 'Trader Bob', 'IN', '08:00'), (2, 'Knight Leo', 'OUT', '09:00');",
    tables: ['log'], expectedResult: (data) => data.columns.length === 4
  },
  {
    id: 5, difficulty: 'Easy', title: "Map Pins",
    scenario: "A scout marked points of interest. He needs the 'latitude' and 'longitude' values.",
    description: "Select 'lat' and 'lng' from the 'points' table.",
    hint: "SELECT lat, lng FROM points;", initialSql: "SELECT * FROM points;",
    setupSql: "CREATE TABLE points (id INT, name TEXT, lat REAL, lng REAL); INSERT INTO points VALUES (1, 'Dragon Nest', 45.5, -122.6);",
    tables: ['points'], expectedResult: (data) => data.columns.length === 2 && data.values.length === 1
  },
  // 6-20: SELECT FROM WHERE
  {
    id: 6, difficulty: 'Easy', title: "Finding Fire",
    scenario: "I only want to see fire-based spells. Others are too cold for me.",
    description: "Select all spells WHERE 'element' is 'Fire'.",
    hint: "WHERE element = 'Fire'", initialSql: "SELECT * FROM spells;",
    setupSql: "CREATE TABLE spells (id INT, name TEXT, element TEXT); INSERT INTO spells VALUES (1, 'Fireball', 'Fire'), (2, 'Ice Spike', 'Ice');",
    tables: ['spells'], expectedResult: (data) => data.values.length === 1 && data.values[0][2] === 'Fire'
  },
  {
    id: 7, difficulty: 'Easy', title: "Experienced Heroes",
    scenario: "The captain only wants heroes who are level 10 or higher.",
    description: "Select heroes WHERE 'level' >= 10.",
    hint: "WHERE level >= 10", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE heroes (id INT, name TEXT, level INT); INSERT INTO heroes VALUES (1, 'Arthur', 15), (2, 'Bedivere', 8);",
    tables: ['heroes'], expectedResult: (data) => data.values.length === 1 && data.values[0][2] === 15
  },
  {
    id: 8, difficulty: 'Easy', title: "Empty Vaults",
    scenario: "Show me which chests are truly empty.",
    description: "Select chest names WHERE 'gold' is 0.",
    hint: "WHERE gold = 0", initialSql: "SELECT * FROM chests;",
    setupSql: "CREATE TABLE chests (id INT, name TEXT, gold INT); INSERT INTO chests VALUES (1, 'Old Chest', 0), (2, 'Shiny Chest', 100);",
    tables: ['chests'], expectedResult: (data) => data.values.length === 1 && data.values[0][1] === 'Old Chest'
  },
  {
    id: 9, difficulty: 'Easy', title: "Mage Guild Only",
    scenario: "I need to find everyone who belongs to the 'Mage' guild.",
    description: "Select names FROM adventurers WHERE 'guild' = 'Mage'.",
    hint: "WHERE guild = 'Mage'", initialSql: "SELECT * FROM adventurers;",
    setupSql: "CREATE TABLE adventurers (id INT, name TEXT, guild TEXT); INSERT INTO adventurers VALUES (1, 'Gandalf', 'Mage'), (2, 'Legolas', 'Archer');",
    tables: ['adventurers'], expectedResult: (data) => data.values.length === 1 && data.values[0][0] === 'Gandalf'
  },
  {
    id: 10, difficulty: 'Easy', title: "Heavy Armor",
    scenario: "The giant needs armor that weighs exactly 50.",
    description: "Select names FROM armor WHERE 'weight' = 50.",
    hint: "WHERE weight = 50", initialSql: "SELECT * FROM armor;",
    setupSql: "CREATE TABLE armor (id INT, name TEXT, weight INT); INSERT INTO armor VALUES (1, 'Steel Plate', 50), (2, 'Chainmail', 30);",
    tables: ['armor'], expectedResult: (data) => data.values.length === 1 && data.values[0][0] === 'Steel Plate'
  },
  {
    id: 11, difficulty: 'Easy', title: "Broken Blades",
    scenario: "Find weapons that have 0 durability left.",
    description: "Select names WHERE 'durability' = 0.",
    hint: "WHERE durability = 0", initialSql: "SELECT * FROM weapons;",
    setupSql: "CREATE TABLE weapons (id INT, name TEXT, durability INT); INSERT INTO weapons VALUES (1, 'Rusty Sword', 0), (2, 'Great Axe', 100);",
    tables: ['weapons'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 12, difficulty: 'Easy', title: "The North Star",
    scenario: "Show me cities that are in the north (latitude > 60).",
    description: "Select * WHERE 'lat' > 60.",
    hint: "WHERE lat > 60", initialSql: "SELECT * FROM cities;",
    setupSql: "CREATE TABLE cities (id INT, name TEXT, lat REAL); INSERT INTO cities VALUES (1, 'Nord', 65.2), (2, 'Sud', 20.1);",
    tables: ['cities'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 13, difficulty: 'Easy', title: "Cheap Potions",
    scenario: "The peasants need potions that cost less than 10 gold.",
    description: "Select * WHERE 'price' < 10.",
    hint: "WHERE price < 10", initialSql: "SELECT * FROM potions;",
    setupSql: "CREATE TABLE potions (id INT, name TEXT, price INT); INSERT INTO potions VALUES (1, 'Weak Heal', 5), (2, 'Super Heal', 50);",
    tables: ['potions'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 14, difficulty: 'Easy', title: "Specific Shield",
    scenario: "I am looking for the 'Aegis' shield. Nothing else.",
    description: "Select * WHERE 'name' = 'Aegis'.",
    hint: "WHERE name = 'Aegis'", initialSql: "SELECT * FROM armor;",
    setupSql: "CREATE TABLE armor (id INT, name TEXT); INSERT INTO armor VALUES (1, 'Aegis'), (2, 'Buckler');",
    tables: ['armor'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 15, difficulty: 'Easy', title: "Exclude Commoners",
    scenario: "We need a list of everyone who is NOT a 'Commoner'.",
    description: "Select * WHERE 'rank' != 'Commoner'.",
    hint: "WHERE rank != 'Commoner'", initialSql: "SELECT * FROM people;",
    setupSql: "CREATE TABLE people (id INT, name TEXT, rank TEXT); INSERT INTO people VALUES (1, 'King', 'Noble'), (2, 'Jack', 'Commoner');",
    tables: ['people'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 16, difficulty: 'Easy', title: "The Elite 100",
    scenario: "Find spells with power exactly 100.",
    description: "Select name WHERE 'power' = 100.",
    hint: "WHERE power = 100", initialSql: "SELECT * FROM spells;",
    setupSql: "CREATE TABLE spells (id INT, name TEXT, power INT); INSERT INTO spells VALUES (1, 'Fireball', 80), (2, 'Ultima', 100);",
    tables: ['spells'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 17, difficulty: 'Easy', title: "Small Towns",
    scenario: "Find towns with population under 500.",
    description: "Select name WHERE 'pop' < 500.",
    hint: "WHERE pop < 500", initialSql: "SELECT * FROM towns;",
    setupSql: "CREATE TABLE towns (id INT, name TEXT, pop INT); INSERT INTO towns VALUES (1, 'Village', 200), (2, 'City', 5000);",
    tables: ['towns'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 18, difficulty: 'Easy', title: "Rare Artifacts",
    scenario: "I only want to see artifacts of 'Legendary' rarity.",
    description: "Select * WHERE 'rarity' = 'Legendary'.",
    hint: "WHERE rarity = 'Legendary'", initialSql: "SELECT * FROM items;",
    setupSql: "CREATE TABLE items (id INT, item TEXT, rarity TEXT); INSERT INTO items VALUES (1, 'Excalibur', 'Legendary'), (2, 'Stick', 'Common');",
    tables: ['items'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 19, difficulty: 'Easy', title: "Dungeon Floor 50",
    scenario: "Which monsters are on floor 50?",
    description: "Select * WHERE 'floor' = 50.",
    hint: "WHERE floor = 50", initialSql: "SELECT * FROM monsters;",
    setupSql: "CREATE TABLE monsters (id INT, name TEXT, floor INT); INSERT INTO monsters VALUES (1, 'Demon', 50), (2, 'Slime', 1);",
    tables: ['monsters'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 20, difficulty: 'Easy', title: "Hidden Quests",
    scenario: "Find quests that give more than 500 exp.",
    description: "Select title WHERE 'exp' > 500.",
    hint: "WHERE exp > 500", initialSql: "SELECT * FROM quests;",
    setupSql: "CREATE TABLE quests (id INT, title TEXT, exp INT); INSERT INTO quests VALUES (1, 'Slay Dragon', 1000), (2, 'Fetch Water', 50);",
    tables: ['quests'], expectedResult: (data) => data.values.length === 1
  },
  // 21-50: SELECT FROM WHERE ORDER BY / LIMIT
  {
    id: 21, difficulty: 'Medium', title: "Leaderboard",
    scenario: "Show me players sorted by their score, highest first.",
    description: "Select name, score FROM players ORDER BY 'score' DESC.",
    hint: "ORDER BY score DESC", initialSql: "SELECT * FROM players;",
    setupSql: "CREATE TABLE players (id INT, name TEXT, score INT); INSERT INTO players VALUES (1, 'Ace', 500), (2, 'Noob', 10);",
    tables: ['players'], expectedResult: (data) => data.values[0][2] === 500
  },
  {
    id: 22, difficulty: 'Medium', title: "The Top 3",
    scenario: "The king wants to see only the top 3 richest merchants.",
    description: "Select name, gold FROM merchants ORDER BY 'gold' DESC LIMIT 3.",
    hint: "ORDER BY gold DESC LIMIT 3", initialSql: "SELECT * FROM merchants;",
    setupSql: "CREATE TABLE merchants (id INT, name TEXT, gold INT); INSERT INTO merchants VALUES (1, 'A', 10), (2, 'B', 20), (3, 'C', 30), (4, 'D', 5);",
    tables: ['merchants'], expectedResult: (data) => data.values.length === 3 && data.values[0][2] === 30
  },
  {
    id: 23, difficulty: 'Medium', title: "Alphabetical Army",
    scenario: "List our soldiers by name from A to Z.",
    description: "Select name FROM soldiers ORDER BY 'name' ASC.",
    hint: "ORDER BY name ASC", initialSql: "SELECT * FROM soldiers;",
    setupSql: "CREATE TABLE soldiers (id INT, name TEXT); INSERT INTO soldiers VALUES (1, 'Zeke'), (2, 'Adam');",
    tables: ['soldiers'], expectedResult: (data) => data.values[0][0] === 'Adam'
  },
  {
    id: 24, difficulty: 'Medium', title: "Fastest Steeds",
    scenario: "Who is the fastest horse we have?",
    description: "Select name FROM horses ORDER BY 'speed' DESC LIMIT 1.",
    hint: "ORDER BY speed DESC LIMIT 1", initialSql: "SELECT * FROM horses;",
    setupSql: "CREATE TABLE horses (id INT, name TEXT, speed INT); INSERT INTO horses VALUES (1, 'Flash', 90), (2, 'Slowpoke', 20);",
    tables: ['horses'], expectedResult: (data) => data.values[0][0] === 'Flash'
  },
  {
    id: 25, difficulty: 'Medium', title: "Cheapest First",
    scenario: "Sort items by price, lowest to highest.",
    description: "Select * FROM shop ORDER BY 'price' ASC.",
    hint: "ORDER BY price ASC", initialSql: "SELECT * FROM shop;",
    setupSql: "CREATE TABLE shop (id INT, item TEXT, price INT); INSERT INTO shop VALUES (1, 'Sword', 100), (2, 'Stick', 1);",
    tables: ['shop'], expectedResult: (data) => data.values[0][2] === 1
  },
  {
    id: 26, difficulty: 'Medium', title: "Ancient Records",
    scenario: "Sort historical events from oldest to newest.",
    description: "Select event FROM history ORDER BY 'year' ASC.",
    hint: "ORDER BY year ASC", initialSql: "SELECT * FROM history;",
    setupSql: "CREATE TABLE history (year INT, event TEXT); INSERT INTO history VALUES (1066, 'Battle'), (500, 'Founding');",
    tables: ['history'], expectedResult: (data) => data.values[0][0] === 500
  },
  {
    id: 27, difficulty: 'Medium', title: "The VIPs",
    scenario: "Find the 5 most experienced players (level 10+) and sort by level.",
    description: "Select name, level WHERE 'level' >= 10 ORDER BY 'level' DESC LIMIT 5.",
    hint: "WHERE level >= 10 ORDER BY level DESC LIMIT 5", initialSql: "SELECT * FROM players;",
    setupSql: "CREATE TABLE players (id INT, name TEXT, level INT); INSERT INTO players VALUES (1, 'A', 5), (2, 'B', 15), (3, 'C', 20);",
    tables: ['players'], expectedResult: (data) => data.values.length <= 5 && data.values[0][2] === 20
  },
  {
    id: 28, difficulty: 'Medium', title: "Latest News",
    scenario: "Show the most recent announcement.",
    description: "Select * FROM news ORDER BY 'id' DESC LIMIT 1.",
    hint: "ORDER BY id DESC LIMIT 1", initialSql: "SELECT * FROM news;",
    setupSql: "CREATE TABLE news (id INT, msg TEXT); INSERT INTO news VALUES (1, 'Old'), (2, 'New');",
    tables: ['news'], expectedResult: (data) => data.values[0][0] === 2
  },
  {
    id: 29, difficulty: 'Medium', title: "Shortest Names",
    scenario: "Find the town with the shortest name (ascending sort by name length or just name manually).",
    description: "Select name FROM towns ORDER BY 'name' ASC LIMIT 1.",
    hint: "ORDER BY name ASC LIMIT 1", initialSql: "SELECT * FROM towns;",
    setupSql: "CREATE TABLE towns (id INT, name TEXT); INSERT INTO towns VALUES (1, 'Rome'), (2, 'Athens');",
    tables: ['towns'], expectedResult: (data) => data.values[0][0] === 'Athens'
  },
  {
    id: 30, difficulty: 'Medium', title: "Power Rankings",
    scenario: "Sort mages by power (desc) but only for the 'Ice' school.",
    description: "Select name WHERE 'school' = 'Ice' ORDER BY 'power' DESC.",
    hint: "WHERE school = 'Ice' ORDER BY power DESC", initialSql: "SELECT * FROM mages;",
    setupSql: "CREATE TABLE mages (id INT, name TEXT, school TEXT, power INT); INSERT INTO mages VALUES (1, 'SubZero', 'Ice', 90), (2, 'Freeze', 'Ice', 50);",
    tables: ['mages'], expectedResult: (data) => data.values[0][3] === 90
  },
  // 31-50: AND, OR, NOT, BETWEEN, IN
  {
    id: 31, difficulty: 'Medium', title: "The Double Check",
    scenario: "Find warriors who are in 'Guild A' AND have more than 50 health.",
    description: "WHERE guild = 'Guild A' AND health > 50",
    hint: "AND health > 50", initialSql: "SELECT * FROM warriors;",
    setupSql: "CREATE TABLE warriors (id INT, name TEXT, guild TEXT, health INT); INSERT INTO warriors VALUES (1, 'A1', 'Guild A', 60), (2, 'A2', 'Guild A', 40);",
    tables: ['warriors'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 32, difficulty: 'Medium', title: "Any Hero Will Do",
    scenario: "Find heroes who are either 'Warriors' OR 'Paladins'.",
    description: "WHERE class = 'Warrior' OR class = 'Paladin'",
    hint: "OR class = 'Paladin'", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE heroes (id INT, name TEXT, class TEXT); INSERT INTO heroes VALUES (1, 'H1', 'Warrior'), (2, 'H2', 'Paladin'), (3, 'H3', 'Mage');",
    tables: ['heroes'], expectedResult: (data) => data.values.length === 2
  },
  {
    id: 33, difficulty: 'Medium', title: "Not a Mimic",
    scenario: "Find chests that are NOT mimics.",
    description: "WHERE type != 'Mimic' (or NOT type = 'Mimic')",
    hint: "WHERE type != 'Mimic'", initialSql: "SELECT * FROM chests;",
    setupSql: "CREATE TABLE chests (id INT, name TEXT, type TEXT); INSERT INTO chests VALUES (1, 'C1', 'Wood'), (2, 'C2', 'Mimic');",
    tables: ['chests'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 34, difficulty: 'Medium', title: "In the Middle",
    scenario: "Find items with price between 10 and 20.",
    description: "WHERE price BETWEEN 10 AND 20",
    hint: "BETWEEN 10 AND 20", initialSql: "SELECT * FROM items;",
    setupSql: "CREATE TABLE items (id INT, item TEXT, price INT); INSERT INTO items VALUES (1, 'I1', 15), (2, 'I2', 5), (3, 'I3', 25);",
    tables: ['items'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 35, difficulty: 'Medium', title: "The Invited List",
    scenario: "Find players with names in ('Alice', 'Bob', 'Charlie').",
    description: "WHERE name IN ('Alice', 'Bob', 'Charlie')",
    hint: "IN ('Alice', 'Bob', 'Charlie')", initialSql: "SELECT * FROM players;",
    setupSql: "CREATE TABLE players (id INT, name TEXT); INSERT INTO players VALUES (1, 'Alice'), (2, 'Dave');",
    tables: ['players'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 36, difficulty: 'Medium', title: "Rich and Levelled",
    scenario: "Find noble players (rank='Noble') with gold > 1000.",
    description: "WHERE rank = 'Noble' AND gold > 1000",
    hint: "AND gold > 1000", initialSql: "SELECT * FROM players;",
    setupSql: "CREATE TABLE players (id INT, rank TEXT, gold INT); INSERT INTO players VALUES (1, 'Noble', 2000), (2, 'Plebeian', 3000);",
    tables: ['players'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 37, difficulty: 'Medium', title: "Magic or Rare",
    scenario: "Find items that are either 'Magic' OR 'Rare'.",
    description: "WHERE quality = 'Magic' OR quality = 'Rare'",
    hint: "OR quality = 'Rare'", initialSql: "SELECT * FROM loot;",
    setupSql: "CREATE TABLE loot (id INT, quality TEXT); INSERT INTO loot VALUES (1, 'Magic'), (2, 'Rare'), (3, 'Common');",
    tables: ['loot'], expectedResult: (data) => data.values.length === 2
  },
  {
    id: 38, difficulty: 'Medium', title: "Safe Range",
    scenario: "Find floor levels between 1 and 10.",
    description: "WHERE floor BETWEEN 1 AND 10",
    hint: "BETWEEN 1 AND 10", initialSql: "SELECT * FROM dungeon;",
    setupSql: "CREATE TABLE dungeon (id INT, floor INT); INSERT INTO dungeon VALUES (1, 5), (2, 20);",
    tables: ['dungeon'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 39, difficulty: 'Medium', title: "Exclude Slimes",
    scenario: "Find monsters that are NOT 'Slime'.",
    description: "WHERE species != 'Slime'",
    hint: "WHERE species != 'Slime'", initialSql: "SELECT * FROM monsters;",
    setupSql: "CREATE TABLE monsters (id INT, species TEXT); INSERT INTO monsters VALUES (1, 'Dragon'), (2, 'Slime');",
    tables: ['monsters'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 40, difficulty: 'Medium', title: "Team Red or Blue",
    scenario: "Find members in team 'Red' or 'Blue'.",
    description: "WHERE team IN ('Red', 'Blue')",
    hint: "IN ('Red', 'Blue')", initialSql: "SELECT * FROM teams;",
    setupSql: "CREATE TABLE teams (id INT, team TEXT); INSERT INTO teams VALUES (1, 'Red'), (2, 'Green');",
    tables: ['teams'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 41, difficulty: 'Medium', title: "Specific Exp Range",
    scenario: "Find quests giving 100 to 200 exp.",
    description: "WHERE exp BETWEEN 100 AND 200",
    hint: "BETWEEN 100 AND 200", initialSql: "SELECT * FROM quests;",
    setupSql: "CREATE TABLE quests (id INT, exp INT); INSERT INTO quests VALUES (1, 150), (2, 300);",
    tables: ['quests'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 42, difficulty: 'Medium', title: "Not Broken",
    scenario: "Find items where durability is NOT 0.",
    description: "WHERE durability != 0 (or > 0)",
    hint: "!= 0", initialSql: "SELECT * FROM gear;",
    setupSql: "CREATE TABLE gear (id INT, durability INT); INSERT INTO gear VALUES (1, 10), (2, 0);",
    tables: ['gear'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 43, difficulty: 'Medium', title: "Cities in Regions",
    scenario: "Find cities in 'Northland' or 'Southland'.",
    description: "WHERE region IN ('Northland', 'Southland')",
    hint: "IN ('Northland', 'Southland')", initialSql: "SELECT * FROM world;",
    setupSql: "CREATE TABLE world (id INT, region TEXT); INSERT INTO world VALUES (1, 'Northland'), (2, 'Westland');",
    tables: ['world'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 44, difficulty: 'Medium', title: "Complex Filter",
    scenario: "Heroes who are 'Mage' AND level > 5.",
    description: "WHERE class = 'Mage' AND level > 5",
    hint: "AND level > 5", initialSql: "SELECT * FROM units;",
    setupSql: "CREATE TABLE units (class TEXT, level INT); INSERT INTO units VALUES ('Mage', 10), ('Mage', 2);",
    tables: ['units'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 45, difficulty: 'Medium', title: "Level or Wealth",
    scenario: "Players with level > 20 OR gold > 5000.",
    description: "WHERE level > 20 OR gold > 5000",
    hint: "OR gold > 5000", initialSql: "SELECT * FROM players;",
    setupSql: "CREATE TABLE players (level INT, gold INT); INSERT INTO players VALUES (25, 100), (5, 6000);",
    tables: ['players'], expectedResult: (data) => data.values.length === 2
  },
  {
    id: 46, difficulty: 'Medium', title: "Strict Age",
    scenario: "Historical records between years 1000 and 1200.",
    description: "WHERE year BETWEEN 1000 AND 1200",
    hint: "BETWEEN 1000 AND 1200", initialSql: "SELECT * FROM history;",
    setupSql: "CREATE TABLE history (year INT); INSERT INTO history VALUES (1100), (1500);",
    tables: ['history'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 47, difficulty: 'Medium', title: "Rank List",
    scenario: "Find users with rank 'Admin' or 'Moderator'.",
    description: "WHERE rank IN ('Admin', 'Moderator')",
    hint: "IN ('Admin', 'Moderator')", initialSql: "SELECT * FROM users;",
    setupSql: "CREATE TABLE users (rank TEXT); INSERT INTO users VALUES ('Admin'), ('User');",
    tables: ['users'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 48, difficulty: 'Medium', title: "Power and Mana",
    scenario: "Spells with power > 50 AND mana < 20.",
    description: "WHERE power > 50 AND mana < 20",
    hint: "AND mana < 20", initialSql: "SELECT * FROM spells;",
    setupSql: "CREATE TABLE spells (power INT, mana INT); INSERT INTO spells VALUES (60, 10), (60, 30);",
    tables: ['spells'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 49, difficulty: 'Medium', title: "Not Poisoned",
    scenario: "Find weapons that are NOT 'Poison' type.",
    description: "WHERE type != 'Poison'",
    hint: "!= 'Poison'", initialSql: "SELECT * FROM weapons;",
    setupSql: "CREATE TABLE weapons (type TEXT); INSERT INTO weapons VALUES ('Steel'), ('Poison');",
    tables: ['weapons'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 50, difficulty: 'Medium', title: "High Level Tier",
    scenario: "Heroes with level between 30 and 50.",
    description: "WHERE level BETWEEN 30 AND 50",
    hint: "BETWEEN 30 AND 50", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE heroes (level INT); INSERT INTO heroes VALUES (40), (20);",
    tables: ['heroes'], expectedResult: (data) => data.values.length === 1
  },
  // 51-100: LIKE, GROUP BY, JOIN, HAVING
  {
    id: 51, difficulty: 'Hard', title: "Search by Prefix",
    scenario: "Find artifacts that start with 'Ice'.",
    description: "WHERE name LIKE 'Ice%'",
    hint: "LIKE 'Ice%'", initialSql: "SELECT * FROM artifacts;",
    setupSql: "CREATE TABLE artifacts (name TEXT); INSERT INTO artifacts VALUES ('Ice Blade'), ('Fire Rod');",
    tables: ['artifacts'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 52, difficulty: 'Hard', title: "Count by Category",
    scenario: "Count how many items are in each category.",
    description: "SELECT category, COUNT(*) FROM shop GROUP BY category;",
    hint: "GROUP BY category", initialSql: "SELECT * FROM shop;",
    setupSql: "CREATE TABLE shop (category TEXT); INSERT INTO shop VALUES ('Weapon'), ('Weapon'), ('Armor');",
    tables: ['shop'], expectedResult: (data) => data.values.length === 2 && data.values.find(v => v[0] === 'Weapon')[1] === 2
  },
  {
    id: 53, difficulty: 'Hard', title: "The Master JOIN",
    scenario: "Combine heroes with their guilds.",
    description: "SELECT heroes.name, guilds.name FROM heroes JOIN guilds ON heroes.guild_id = guilds.id;",
    hint: "JOIN guilds ON ...", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE guilds (id INT, name TEXT); CREATE TABLE heroes (name TEXT, guild_id INT); INSERT INTO guilds VALUES (1, 'Light'); INSERT INTO heroes VALUES ('Gawain', 1);",
    tables: ['heroes', 'guilds'], expectedResult: (data) => data.columns.length === 2
  },
  {
    id: 54, difficulty: 'Hard', title: "Average Power",
    scenario: "Find average power for each school of magic.",
    description: "SELECT school, AVG(power) FROM spells GROUP BY school;",
    hint: "GROUP BY school", initialSql: "SELECT * FROM spells;",
    setupSql: "CREATE TABLE spells (school TEXT, power INT); INSERT INTO spells VALUES ('Fire', 80), ('Fire', 20);",
    tables: ['spells'], expectedResult: (data) => data.values.find(v => v[0] === 'Fire')[1] === 50
  },
  {
    id: 55, difficulty: 'Hard', title: "Contains Sword",
    scenario: "Find any item with 'Sword' in its name.",
    description: "WHERE name LIKE '%Sword%'",
    hint: "LIKE '%Sword%'", initialSql: "SELECT * FROM items;",
    setupSql: "CREATE TABLE items (name TEXT); INSERT INTO items VALUES ('Longsword'), ('Broadsword'), ('Dagger');",
    tables: ['items'], expectedResult: (data) => data.values.length === 2
  },
  {
    id: 56, difficulty: 'Hard', title: "Sum of Gold",
    scenario: "Find total gold for each merchant.",
    description: "SELECT merchant, SUM(gold) FROM treasury GROUP BY merchant;",
    hint: "SUM(gold) GROUP BY merchant", initialSql: "SELECT * FROM treasury;",
    setupSql: "CREATE TABLE treasury (merchant TEXT, gold INT); INSERT INTO treasury VALUES ('Bob', 100), ('Bob', 50);",
    tables: ['treasury'], expectedResult: (data) => data.values[0][1] === 150
  },
  {
    id: 57, difficulty: 'Hard', title: "Guild Member Count",
    scenario: "Find guilds that have more than 1 member using HAVING.",
    description: "SELECT guild, COUNT(*) FROM members GROUP BY guild HAVING COUNT(*) > 1;",
    hint: "HAVING COUNT(*) > 1", initialSql: "SELECT * FROM members;",
    setupSql: "CREATE TABLE members (guild TEXT); INSERT INTO members VALUES ('Mage'), ('Mage'), ('Warrior');",
    tables: ['members'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 58, difficulty: 'Hard', title: "Map Locations",
    scenario: "Join markers with their map info.",
    description: "SELECT markers.name, maps.region FROM markers JOIN maps ON markers.map_id = maps.id;",
    hint: "JOIN maps ON markers.map_id = maps.id", initialSql: "SELECT * FROM markers;",
    setupSql: "CREATE TABLE maps (id INT, region TEXT); CREATE TABLE markers (name TEXT, map_id INT); INSERT INTO maps VALUES (1, 'Valley'); INSERT INTO markers VALUES ('Hub', 1);",
    tables: ['markers', 'maps'], expectedResult: (data) => data.columns.length === 2
  },
  {
    id: 59, difficulty: 'Hard', title: "End with Rod",
    scenario: "Find artifacts ending with 'Rod'.",
    description: "WHERE name LIKE '%Rod'",
    hint: "LIKE '%Rod'", initialSql: "SELECT * FROM artifacts;",
    setupSql: "CREATE TABLE artifacts (name TEXT); INSERT INTO artifacts VALUES ('Fire Rod'), ('Magic Rod');",
    tables: ['artifacts'], expectedResult: (data) => data.values.length === 2
  },
  {
    id: 60, difficulty: 'Hard', title: "Most Valuable",
    scenario: "Find the max value for each loot type.",
    description: "SELECT type, MAX(val) FROM loot GROUP BY type;",
    hint: "MAX(val) GROUP BY type", initialSql: "SELECT * FROM loot;",
    setupSql: "CREATE TABLE loot (type TEXT, val INT); INSERT INTO loot VALUES ('Gem', 100), ('Gem', 500);",
    tables: ['loot'], expectedResult: (data) => data.values[0][1] === 500
  },
  // 61-80: Relationships, Subqueries, more JOINs
  {
    id: 61, difficulty: 'Hard', title: "Double Join",
    scenario: "Heroes, their guilds, and the guild's location.",
    description: "SELECT heroes.name, guilds.name, locations.region FROM heroes JOIN guilds ON heroes.guild_id = guilds.id JOIN locations ON guilds.loc_id = locations.id;",
    hint: "JOIN guilds ... JOIN locations ...", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE locations (id INT, region TEXT); CREATE TABLE guilds (id INT, name TEXT, loc_id INT); CREATE TABLE heroes (name TEXT, guild_id INT); INSERT INTO locations VALUES (1, 'West'); INSERT INTO guilds VALUES (1, 'Light', 1); INSERT INTO heroes VALUES ('Sola', 1);",
    tables: ['heroes', 'guilds', 'locations'], expectedResult: (data) => data.columns.length === 3
  },
  {
    id: 62, difficulty: 'Hard', title: "Subquery Filter",
    scenario: "Find items more expensive than the average price.",
    description: "WHERE price > (SELECT AVG(price) FROM shop)",
    hint: "WHERE price > (SELECT AVG(price) FROM shop)", initialSql: "SELECT * FROM shop;",
    setupSql: "CREATE TABLE shop (id INT, price INT); INSERT INTO shop VALUES (1, 10), (2, 100);",
    tables: ['shop'], expectedResult: (data) => data.values.length === 1 && data.values[0][1] === 100
  },
  {
    id: 63, difficulty: 'Hard', title: "Self Join",
    scenario: "Find employees and their managers (same table).",
    description: "SELECT e.name, m.name as manager FROM emp e JOIN emp m ON e.mgr_id = m.id;",
    hint: "JOIN emp m ON e.mgr_id = m.id", initialSql: "SELECT * FROM emp;",
    setupSql: "CREATE TABLE emp (id INT, name TEXT, mgr_id INT); INSERT INTO emp VALUES (1, 'Boss', NULL), (2, 'Minion', 1);",
    tables: ['emp'], expectedResult: (data) => data.values.length === 1 && data.values[0][1] === 'Boss'
  },
  {
    id: 64, difficulty: 'Hard', title: "Count vs Count",
    scenario: "Find guilds with exactly 2 members.",
    description: "GROUP BY guild HAVING COUNT(*) = 2",
    hint: "HAVING COUNT(*) = 2", initialSql: "SELECT * FROM members;",
    setupSql: "CREATE TABLE members (guild TEXT); INSERT INTO members VALUES ('G1'), ('G1'), ('G2');",
    tables: ['members'], expectedResult: (data) => data.values.length === 1 && data.values[0][0] === 'G1'
  },
  {
    id: 65, difficulty: 'Hard', title: "Exists Check",
    scenario: "Merchants who have at least one 'Red' potion.",
    description: "SELECT name FROM merchants m WHERE EXISTS (SELECT 1 FROM stock s WHERE s.merch_id = m.id AND s.color = 'Red');",
    hint: "WHERE EXISTS (SELECT 1 FROM stock ...)", initialSql: "SELECT * FROM merchants;",
    setupSql: "CREATE TABLE merchants (id INT, name TEXT); CREATE TABLE stock (merch_id INT, color TEXT); INSERT INTO merchants VALUES (1, 'Alice'); INSERT INTO stock VALUES (1, 'Red');",
    tables: ['merchants', 'stock'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 66, difficulty: 'Hard', title: "Not In Subquery",
    scenario: "Find players who haven't completed any quests.",
    description: "WHERE id NOT IN (SELECT player_id FROM results)",
    hint: "WHERE id NOT IN (SELECT player_id FROM results)", initialSql: "SELECT * FROM players;",
    setupSql: "CREATE TABLE players (id INT, name TEXT); CREATE TABLE results (player_id INT); INSERT INTO players VALUES (1, 'Active'), (2, 'Inactive'); INSERT INTO results VALUES (1);",
    tables: ['players', 'results'], expectedResult: (data) => data.values.length === 1 && data.values[0][1] === 'Inactive'
  },
  {
    id: 67, difficulty: 'Hard', title: "Multi-Col Sort",
    scenario: "Sort spells by school (asc) and then by power (desc).",
    description: "ORDER BY school ASC, power DESC",
    hint: "ORDER BY school ASC, power DESC", initialSql: "SELECT * FROM spells;",
    setupSql: "CREATE TABLE spells (school TEXT, power INT); INSERT INTO spells VALUES ('Fire', 50), ('Fire', 80), ('Ice', 30);",
    tables: ['spells'], expectedResult: (data) => data.values[0][0] === 'Fire' && data.values[0][1] === 80
  },
  {
    id: 68, difficulty: 'Hard', title: "The Union Query",
    scenario: "Combine names from archers and knights into one list.",
    description: "SELECT name FROM archers UNION SELECT name FROM knights;",
    hint: "SELECT name FROM archers UNION SELECT name FROM knights;", initialSql: "SELECT name FROM archers;",
    setupSql: "CREATE TABLE archers (name TEXT); CREATE TABLE knights (name TEXT); INSERT INTO archers VALUES ('Robin'); INSERT INTO knights VALUES ('Lancelot');",
    tables: ['archers', 'knights'], expectedResult: (data) => data.values.length === 2
  },
  {
    id: 69, difficulty: 'Hard', title: "String Filter Complex",
    scenario: "Find items with name containing 'Magic' and ending in 'A'.",
    description: "WHERE name LIKE '%Magic%A'",
    hint: "LIKE '%Magic%A'", initialSql: "SELECT * FROM items;",
    setupSql: "CREATE TABLE items (name TEXT); INSERT INTO items VALUES ('Magic Aura'), ('Magic Wand'), ('Gem A');",
    tables: ['items'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 70, difficulty: 'Hard', title: "Group by Many",
    scenario: "Count items per category and per quality.",
    description: "SELECT category, quality, COUNT(*) FROM shop GROUP BY category, quality;",
    hint: "GROUP BY category, quality", initialSql: "SELECT * FROM shop;",
    setupSql: "CREATE TABLE shop (category TEXT, quality TEXT); INSERT INTO shop VALUES ('W', 'M'), ('W', 'M'), ('W', 'R');",
    tables: ['shop'], expectedResult: (data) => data.values.length === 2
  },
  {
    id: 71, difficulty: 'Hard', title: "Find Max in Group",
    scenario: "Find the strongest player in EACH guild.",
    description: "SELECT guild, MAX(lvl) FROM players GROUP BY guild;",
    hint: "MAX(lvl) GROUP BY guild", initialSql: "SELECT * FROM players;",
    setupSql: "CREATE TABLE players (guild TEXT, lvl INT); INSERT INTO players VALUES ('G1', 10), ('G1', 20), ('G2', 5);",
    tables: ['players'], expectedResult: (data) => data.values.find(v => v[0] === 'G1')[1] === 20
  },
  {
    id: 72, difficulty: 'Hard', title: "The Offset",
    scenario: "Show the 2nd most powerful spell (skip the first).",
    description: "ORDER BY power DESC LIMIT 1 OFFSET 1",
    hint: "LIMIT 1 OFFSET 1", initialSql: "SELECT * FROM spells;",
    setupSql: "CREATE TABLE spells (name TEXT, power INT); INSERT INTO spells VALUES ('S1', 100), ('S2', 90), ('S3', 80);",
    tables: ['spells'], expectedResult: (data) => data.values[0][0] === 'S2'
  },
  {
    id: 73, difficulty: 'Hard', title: "Alias Usage",
    scenario: "Calculate tax (10%) and show it as 'tax_amount'.",
    description: "SELECT name, price * 0.1 as tax_amount FROM stock;",
    hint: "price * 0.1 as tax_amount", initialSql: "SELECT * FROM stock;",
    setupSql: "CREATE TABLE stock (name TEXT, price INT); INSERT INTO stock VALUES ('Sword', 100);",
    tables: ['stock'], expectedResult: (data) => data.columns.includes('tax_amount')
  },
  {
    id: 74, difficulty: 'Hard', title: "Outer JOIN Intro",
    scenario: "Find all guilds and their heroes, including guilds with NO heroes.",
    description: "SELECT guilds.name, heroes.name FROM guilds LEFT JOIN heroes ON guilds.id = heroes.guild_id;",
    hint: "LEFT JOIN heroes ON guilds.id = heroes.guild_id", initialSql: "SELECT * FROM guilds;",
    setupSql: "CREATE TABLE guilds (id INT, name TEXT); CREATE TABLE heroes (name TEXT, guild_id INT); INSERT INTO guilds VALUES (1, 'Empty'), (2, 'Full'); INSERT INTO heroes VALUES ('H1', 2);",
    tables: ['guilds', 'heroes'], expectedResult: (data) => data.values.length === 2
  },
  {
    id: 75, difficulty: 'Hard', title: "Multi-Condition Limit",
    scenario: "Top 2 heroes from Guild A with level over 10.",
    description: "WHERE guild = 'Guild A' AND level > 10 ORDER BY level DESC LIMIT 2",
    hint: "WHERE ... AND ... ORDER BY ... LIMIT 2", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE heroes (guild TEXT, level INT); INSERT INTO heroes VALUES ('Guild A', 15), ('Guild A', 20), ('Guild A', 5);",
    tables: ['heroes'], expectedResult: (data) => data.values.length === 2 && data.values[0][1] === 20
  },
  {
    id: 76, difficulty: 'Hard', title: "Subquery with Comparison",
    scenario: "Find spells belonging to the mage 'Zaltar'.",
    description: "WHERE mage_id = (SELECT id FROM mages WHERE name = 'Zaltar')",
    hint: "(SELECT id FROM mages WHERE name = 'Zaltar')", initialSql: "SELECT * FROM spells;",
    setupSql: "CREATE TABLE mages (id INT, name TEXT); CREATE TABLE spells (name TEXT, mage_id INT); INSERT INTO mages VALUES (1, 'Zaltar'); INSERT INTO spells VALUES ('Fire', 1), ('Ice', 2);",
    tables: ['mages', 'spells'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 77, difficulty: 'Hard', title: "Check Any in List",
    scenario: "Find any merchant selling 'Fire' or 'Ice' stones.",
    description: "WHERE item IN ('Fire Stone', 'Ice Stone')",
    hint: "IN ('Fire Stone', 'Ice Stone')", initialSql: "SELECT * FROM inventory;",
    setupSql: "CREATE TABLE inventory (item TEXT); INSERT INTO inventory VALUES ('Fire Stone'), ('Water Stone');",
    tables: ['inventory'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 78, difficulty: 'Hard', title: "Case Statement 2",
    scenario: "Label power levels: >80 'High', else 'Low'.",
    description: "SELECT name, CASE WHEN power > 80 THEN 'High' ELSE 'Low' END as tier FROM spells;",
    hint: "CASE WHEN ... THEN ... ELSE ... END", initialSql: "SELECT * FROM spells;",
    setupSql: "CREATE TABLE spells (name TEXT, power INT); INSERT INTO spells VALUES ('S1', 90), ('S2', 40);",
    tables: ['spells'], expectedResult: (data) => data.values[0][1] === 'High'
  },
  {
    id: 79, difficulty: 'Hard', title: "Nested Aggregate",
    scenario: "Find the guild with the highest SUM of member EXP.",
    description: "SELECT guild FROM (SELECT guild, SUM(exp) as total_exp FROM heroes GROUP BY guild) ORDER BY total_exp DESC LIMIT 1;",
    hint: "SUBQUERY total_exp ORDER BY total_exp DESC LIMIT 1", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE heroes (guild TEXT, exp INT); INSERT INTO heroes VALUES ('G1', 10), ('G1', 10), ('G2', 30);",
    tables: ['heroes'], expectedResult: (data) => data.values[0][0] === 'G2'
  },
  {
    id: 80, difficulty: 'Hard', title: "Pattern Search Any",
    scenario: "Find names with exactly 5 characters.",
    description: "WHERE name LIKE '_____' (5 underscores)",
    hint: "LIKE '_____' (5 underscores)", initialSql: "SELECT * FROM names;",
    setupSql: "CREATE TABLE names (name TEXT); INSERT INTO names VALUES ('Arith'), ('Bob'), ('Alaric');",
    tables: ['names'], expectedResult: (data) => data.values.length === 1
  },
  // 81-100: Mastery Challenges
  {
    id: 81, difficulty: 'Hard', title: "Double Case",
    scenario: "Rank heroes by level: >50 'Master', >20 'Elite', else 'Rookie'.",
    description: "CASE WHEN level > 50 THEN 'Master' WHEN level > 20 THEN 'Elite' ELSE 'Rookie' END as rank",
    hint: "WHEN level > 50 ... WHEN level > 20 ...", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE heroes (name TEXT, level INT); INSERT INTO heroes VALUES ('A', 60), ('B', 30), ('C', 10);",
    tables: ['heroes'], expectedResult: (data) => data.values[0][2] === 'Master'
  },
  {
    id: 82, difficulty: 'Hard', title: "Complex Exclusion",
    scenario: "Find items NOT in 'Common' category AND price < 100.",
    description: "WHERE category != 'Common' AND price < 100",
    hint: "!= 'Common' AND price < 100", initialSql: "SELECT * FROM shop;",
    setupSql: "CREATE TABLE shop (category TEXT, price INT); INSERT INTO shop VALUES ('Rare', 50), ('Common', 10), ('Rare', 200);",
    tables: ['shop'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 83, difficulty: 'Hard', title: "Subquery Exists 2",
    scenario: "Guilds that have at least one level 99 hero.",
    description: "SELECT name FROM guilds g WHERE EXISTS (SELECT 1 FROM heroes h WHERE h.guild_id = g.id AND h.level = 99);",
    hint: "EXISTS (SELECT 1 FROM heroes ...)", initialSql: "SELECT * FROM guilds;",
    setupSql: "CREATE TABLE guilds (id INT, name TEXT); CREATE TABLE heroes (guild_id INT, level INT); INSERT INTO guilds VALUES (1, 'Godly'), (2, 'Low'); INSERT INTO heroes VALUES (1, 99), (2, 10);",
    tables: ['guilds', 'heroes'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 84, difficulty: 'Hard', title: "Coalesce Mock",
    scenario: "Show name, if title is NULL show 'No Title'.",
    description: "SELECT name, COALESCE(title, 'No Title') FROM npcs;",
    hint: "COALESCE(title, 'No Title')", initialSql: "SELECT * FROM npcs;",
    setupSql: "CREATE TABLE npcs (name TEXT, title TEXT); INSERT INTO npcs VALUES ('John', NULL), ('Pete', 'Mayor');",
    tables: ['npcs'], expectedResult: (data) => data.values[0][1] === 'No Title'
  },
  {
    id: 85, difficulty: 'Hard', title: "Full Join Simulator",
    scenario: "Find all heroes and all guilds (simulated with UNION of LEFT/RIGHT or similar logic).",
    description: "SELECT h.name, g.name FROM heroes h LEFT JOIN guilds g ON h.guild_id = g.id;",
    hint: "LEFT JOIN guilds ON h.guild_id = g.id", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE guilds (id INT, name TEXT); CREATE TABLE heroes (name TEXT, guild_id INT); INSERT INTO guilds VALUES (1, 'G'); INSERT INTO heroes VALUES ('H', 2);",
    tables: ['heroes', 'guilds'], expectedResult: (data) => data.columns.length === 2
  },
  {
    id: 86, difficulty: 'Hard', title: "Count Distinct",
    scenario: "Count how many UNIQUE guild IDs are in the heroes table.",
    description: "SELECT COUNT(DISTINCT guild_id) FROM heroes;",
    hint: "COUNT(DISTINCT guild_id)", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE heroes (guild_id INT); INSERT INTO heroes VALUES (1), (1), (2), (3);",
    tables: ['heroes'], expectedResult: (data) => data.values[0][0] === 3
  },
  {
    id: 87, difficulty: 'Hard', title: "Filter by Aggregate",
    scenario: "Find schools where the total power of all spells is > 200.",
    description: "GROUP BY school HAVING SUM(power) > 200",
    hint: "HAVING SUM(power) > 200", initialSql: "SELECT * FROM spells;",
    setupSql: "CREATE TABLE spells (school TEXT, power INT); INSERT INTO spells VALUES ('Fire', 150), ('Fire', 100), ('Ice', 50);",
    tables: ['spells'], expectedResult: (data) => data.values.length === 1 && data.values[0][0] === 'Fire'
  },
  {
    id: 88, difficulty: 'Hard', title: "Double Search",
    scenario: "Artifacts containing 'Magic' and having 'Power' in description.",
    description: "WHERE name LIKE '%Magic%' AND desc LIKE '%Power%'",
    hint: "LIKE '%Magic%' AND desc LIKE '%Power%'", initialSql: "SELECT * FROM artifacts;",
    setupSql: "CREATE TABLE artifacts (name TEXT, desc TEXT); INSERT INTO artifacts VALUES ('Magic Wand', 'High Power'), ('Old Wand', 'High Power');",
    tables: ['artifacts'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 89, difficulty: 'Hard', title: "Subquery Max",
    scenario: "Items that have the literal maximum price in the table.",
    description: "WHERE price = (SELECT MAX(price) FROM shop)",
    hint: "WHERE price = (SELECT MAX(price) FROM shop)", initialSql: "SELECT * FROM shop;",
    setupSql: "CREATE TABLE shop (name TEXT, price INT); INSERT INTO shop VALUES ('I1', 10), ('I2', 50), ('I3', 50);",
    tables: ['shop'], expectedResult: (data) => data.values.length === 2
  },
  {
    id: 90, difficulty: 'Hard', title: "Mathematical Hero",
    scenario: "Show name and (str + dex + int) as 'total_stats'.",
    description: "SELECT name, (str + dex + int) as total_stats FROM heroes;",
    hint: "(str + dex + int) as total_stats", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE heroes (name TEXT, str INT, dex INT, int INT); INSERT INTO heroes VALUES ('Conan', 10, 5, 2);",
    tables: ['heroes'], expectedResult: (data) => data.values[0][1] === 17
  },
  {
    id: 91, difficulty: 'Hard', title: "Logical NOT IN",
    scenario: "Mages who do NOT know the 'Fireball' spell.",
    description: "SELECT name FROM mages WHERE id NOT IN (SELECT mage_id FROM spells WHERE spell_name = 'Fireball');",
    hint: "NOT IN (SELECT mage_id FROM spells WHERE spell_name = 'Fireball')", initialSql: "SELECT * FROM mages;",
    setupSql: "CREATE TABLE mages (id INT, name TEXT); CREATE TABLE spells (mage_id INT, spell_name TEXT); INSERT INTO mages VALUES (1, 'Z'), (2, 'X'); INSERT INTO spells VALUES (1, 'Fireball');",
    tables: ['mages', 'spells'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 92, difficulty: 'Hard', title: "Join with Limit",
    scenario: "The 3 most powerful heroes and their guild names.",
    description: "SELECT h.name, g.name FROM heroes h JOIN guilds g ON h.guild_id = g.id ORDER BY h.lvl DESC LIMIT 3;",
    hint: "JOIN ... ORDER BY ... LIMIT 3", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE guilds (id INT, name TEXT); CREATE TABLE heroes (name TEXT, guild_id INT, lvl INT); INSERT INTO guilds (id, name) VALUES (1, 'G'); INSERT INTO heroes VALUES ('H1', 1, 50), ('H2', 1, 40), ('H3', 1, 30), ('H4', 1, 20);",
    tables: ['heroes', 'guilds'], expectedResult: (data) => data.values.length === 3
  },
  {
    id: 93, difficulty: 'Hard', title: "Average comparison",
    scenario: "Guilds where member average level is > 20.",
    description: "SELECT guild_id FROM heroes GROUP BY guild_id HAVING AVG(lvl) > 20;",
    hint: "GROUP BY guild_id HAVING AVG(lvl) > 20", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE heroes (guild_id INT, lvl INT); INSERT INTO heroes VALUES (1, 30), (1, 20), (2, 10);",
    tables: ['heroes'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 94, difficulty: 'Hard', title: "String Manipulation Mock",
    scenario: "Find items starting with 'S' and ending with 'd'.",
    description: "WHERE name LIKE 'S%d'",
    hint: "LIKE 'S%d'", initialSql: "SELECT * FROM items;",
    setupSql: "CREATE TABLE items (name TEXT); INSERT INTO items VALUES ('Sword'), ('Shield'), ('Shed');",
    tables: ['items'], expectedResult: (data) => data.values.length === 1 && data.values[0][0] === 'Sword'
  },
  {
    id: 95, difficulty: 'Hard', title: "Multiple Join Stats",
    scenario: "Count of items owned by each hero.",
    description: "SELECT h.name, COUNT(i.id) FROM heroes h JOIN items i ON h.id = i.owner_id GROUP BY h.name;",
    hint: "JOIN ... GROUP BY h.name", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE heroes (id INT, name TEXT); CREATE TABLE items (id INT, owner_id INT); INSERT INTO heroes VALUES (1, 'H1'); INSERT INTO items VALUES (10, 1), (11, 1);",
    tables: ['heroes', 'items'], expectedResult: (data) => data.values[0][1] === 2
  },
  {
    id: 96, difficulty: 'Hard', title: "Between AND or",
    scenario: "Level between 1-10 OR 90-100.",
    description: "WHERE (level BETWEEN 1 AND 10) OR (level BETWEEN 90 AND 100)",
    hint: "WHERE (level BETWEEN 1 AND 10) OR (level BETWEEN 90 AND 100)", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE heroes (level INT); INSERT INTO heroes VALUES (5), (50), (95);",
    tables: ['heroes'], expectedResult: (data) => data.values.length === 2
  },
  {
    id: 97, difficulty: 'Hard', title: "Self Join Manager",
    scenario: "Find which hero mentors which trainee.",
    description: "SELECT m.name as mentor, t.name as trainee FROM heroes m JOIN heroes t ON m.id = t.mentor_id;",
    hint: "JOIN heroes t ON m.id = t.mentor_id", initialSql: "SELECT * FROM heroes;",
    setupSql: "CREATE TABLE heroes (id INT, name TEXT, mentor_id INT); INSERT INTO heroes VALUES (1, 'Master', NULL), (2, 'Student', 1);",
    tables: ['heroes'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 98, difficulty: 'Hard', title: "Subquery Exists Any",
    scenario: "Mages whose library has any 'Forbidden' book.",
    description: "SELECT name FROM mages m WHERE EXISTS (SELECT 1 FROM books b WHERE b.owner_id = m.id AND b.type = 'Forbidden');",
    hint: "EXISTS (SELECT 1 FROM books WHERE ... AND type = 'Forbidden')", initialSql: "SELECT * FROM mages;",
    setupSql: "CREATE TABLE mages (id INT, name TEXT); CREATE TABLE books (owner_id INT, type TEXT); INSERT INTO mages VALUES (1, 'A'); INSERT INTO books VALUES (1, 'Forbidden');",
    tables: ['mages', 'books'], expectedResult: (data) => data.values.length === 1
  },
  {
    id: 99, difficulty: 'Hard', title: "Master Case Agg",
    scenario: "Find sum of gold, count as 'rich_gold' if > 100, else 'poor_gold'.",
    description: "SELECT SUM(gold) FROM players;",
    hint: "SELECT SUM(gold) FROM players;", initialSql: "SELECT SUM(gold) FROM players;",
    setupSql: "CREATE TABLE players (gold INT); INSERT INTO players VALUES (50), (150);",
    tables: ['players'], expectedResult: (data) => data.values[0][0] === 200
  },
  {
    id: 100, difficulty: 'Hard', title: "Grand Final",
    scenario: "The Hero of Legend! Find the name of the warrior with the highest strength in the guild with the most members.",
    description: "One giant query! (Hint: use multiple subqueries or deep joins)",
    hint: "WHERE guild_id = (SELECT guild_id FROM heroes GROUP BY guild_id ORDER BY COUNT(*) DESC LIMIT 1) ORDER BY str DESC LIMIT 1", initialSql: "SELECT name FROM heroes;",
    setupSql: "CREATE TABLE heroes (name TEXT, guild_id INT, str INT); INSERT INTO heroes VALUES ('H1', 1, 10), ('H2', 2, 50), ('H3', 2, 40);",
    tables: ['heroes'], expectedResult: (data) => data.values[0][0] === 'H2'
  }
];





