export function getRandomColor(): {name:string,hsl:{h:number,s:number,l:number}} {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}
type hsl = {
  h: number,
  s: number,
  l: number,
  a?: number
  // percentage?: number
}
export function getDifs(color: hsl, colors: Array<hsl>): Array<{color:hsl, percentage: number}> {
  const result: Array<any> = [];
  for (let i = 0; i < colors.length; i++) {
    let hDif = (100 - ((color.h > colors[i].h ? color.h - colors[i].h : colors[i].h - color.h) / 2.55)) * 0.7;
    let sDif = (100 - (color.s > colors[i].s ? color.s - colors[i].s : colors[i].s - color.s)) * 0.1;
    let lDif = (100 - (color.l > colors[i].l ? color.l - colors[i].l : colors[i].l - color.l)) * 0.2;
    // colors[i].percentage = Math.round((hDif+sDif+lDif) * 100) / 100

    result.push({
      color: colors[i],
      percentage:Math.round((hDif+sDif+lDif) * 100) / 100
    })
  }
  return result;
}
export const colors: Array<{name:string,hsl:{h:number,s:number,l:number}}> = [
  { name: 'AliceBlue', hsl: { h: 208, s: 100, l: 98 } },
  { name: 'AntiqueWhite', hsl: { h: 38, s: 18, l: 94 } },
  { name: 'Aqua', hsl: { h: 180, s: 100, l: 50 } },
  { name: 'Aquamarine', hsl: { h: 160, s: 78, l: 50 } },
  { name: 'Azure', hsl: { h: 208, s: 100, l: 90 } },
  { name: 'Beige', hsl: { h: 40, s: 10, l: 92 } },
  { name: 'Bisque', hsl: { h: 30, s: 25, l: 96 } },
  { name: 'Black', hsl: { h: 0, s: 0, l: 0 } },
  { name: 'BlanchedAlmond', hsl: { h: 32, s: 20, l: 95 } },
  { name: 'Blue', hsl: { h: 240, s: 100, l: 50 } },
  { name: 'BlueViolet', hsl: { h: 270, s: 73, l: 40 } },
  { name: 'Brown', hsl: { h: 0, s: 20, l: 20 } },
  { name: 'BurlyWood', hsl: { h: 30, s: 15, l: 87 } },
  { name: 'CadetBlue', hsl: { h: 210, s: 35, l: 45 } },
  { name: 'Chartreuse', hsl: { h: 90, s: 100, l: 50 } },
  { name: 'Chocolate', hsl: { h: 30, s: 40, l: 30 } },
  { name: 'Coral', hsl: { h: 15, s: 90, l: 50 } },
  { name: 'CornflowerBlue', hsl: { h: 240, s: 67, l: 56 } },
  { name: 'Cornsilk', hsl: { h: 45, s: 20, l: 98 } },
  { name: 'Crimson', hsl: { h: 348, s: 100, l: 40 } },
  { name: 'Cyan', hsl: { h: 180, s: 100, l: 50 } },
  { name: 'DarkBlue', hsl: { h: 240, s: 100, l: 25 } },
  { name: 'DarkCyan', hsl: { h: 180, s: 100, l: 25 } },
  { name: 'DarkGoldenRod', hsl: { h: 40, s: 40, l: 30 } },
  { name: 'DarkGray', hsl: { h: 0, s: 0, l: 40 } },
  { name: 'DarkGreen', hsl: { h: 120, s: 100, l: 25 } },
  { name: 'DarkGrey', hsl: { h: 0, s: 0, l: 40 } },
  { name: 'DarkKhaki', hsl: { h: 40, s: 15, l: 50 } },
  { name: 'DarkMagenta', hsl: { h: 300, s: 100, l: 25 } },
  { name: 'DarkOliveGreen', hsl: { h: 80, s: 40, l: 25 } },
  { name: 'DarkOrange', hsl: { h: 30, s: 100, l: 50 } },
  { name: 'DarkOrchid', hsl: { h: 290, s: 70, l: 30 } },
  { name: 'DarkRed', hsl: { h: 0, s: 100, l: 25 } },
  { name: 'DarkSalmon', hsl: { h: 15, s: 35, l: 55 } },
  { name: 'DarkSeaGreen', hsl: { h: 140, s: 35, l: 45 } },
  { name: 'DarkSlateBlue', hsl: { h: 240, s: 30, l: 20 } },
  { name: 'DarkSlateGray', hsl: { h: 210, s: 20, l: 20 } },
  { name: 'DarkSlateGrey', hsl: { h: 210, s: 20, l: 20 } },
  { name: 'DarkTurquoise', hsl: { h: 180, s: 100, l: 35 } },
  { name: 'DarkViolet', hsl: { h: 280, s: 100, l: 30 } },
  { name: 'DeepPink', hsl: { h: 330, s: 100, l: 50 } },
  { name: 'DeepSkyBlue', hsl: { h: 195, s: 100, l: 50 } },
  { name: 'DimGray', hsl: { h: 0, s: 0, l: 30 } },
  { name: 'DimGrey', hsl: { h: 0, s: 0, l: 30 } },
  { name: 'DodgerBlue', hsl: { h: 225, s: 100, l: 48 } },
  { name: 'FireBrick', hsl: { h: 10, s: 80, l: 30 } },
  { name: 'FloralWhite', hsl: { h: 0, s: 5, l: 98 } },
  { name: 'ForestGreen', hsl: { h: 120, s: 100, l: 30 } },
  { name: 'Fuchsia', hsl: { h: 300, s: 100, l: 50 } },
  { name: 'Gainsboro', hsl: { h: 0, s: 0, l: 80 } },
  { name: 'GhostWhite', hsl: { h: 0, s: 5, l: 97 } },
  { name: 'Gold', hsl: { h: 50, s: 100, l: 50 } },
  { name: 'GoldenRod', hsl: { h: 40, s: 50, l: 50 } },
  { name: 'Gray', hsl: { h: 0, s: 0, l: 50 } },
  { name: 'Green', hsl: { h: 120, s: 100, l: 50 } },
  { name: 'GreenYellow', hsl: { h: 80, s: 100, l: 75 } },
  { name: 'Grey', hsl: { h: 0, s: 0, l: 50 } },
  { name: 'Honeydew', hsl: { h: 90, s: 10, l: 94 } },
  { name: 'HotPink', hsl: { h: 330, s: 100, l: 70 } },
  { name: 'IndianRed', hsl: { h: 10, s: 60, l: 40 } },
  { name: 'Indigo', hsl: { h: 270, s: 70, l: 20 } }
]