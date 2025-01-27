export function randomCode(): string {
  const chars: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  let code: string = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

import { data } from './openpeeps';
export function randomCharacter() {
  return {
    name: "Marv",
    body: Math.floor(Math.random() * data.body.length),
    face: Math.floor(Math.random() * data.face.length),
    head: Math.floor(Math.random() * data.head.length),
    accessories: Math.floor(Math.random() * data.accessories.length),
  }
}