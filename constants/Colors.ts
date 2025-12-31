// const tintColorLight = '#fd4a12';
// const tintColorDark = '#fd4a12';

// export default {
//   light: {
//     text: '#000',
//     background: '#fff',
//     tint: tintColorLight,
//     tabIconDefault: '#ccc',
//     tabIconSelected: tintColorLight,
//   },
//   dark: {
//     text: '#fff',
//     background: '#000',
//     tint: tintColorDark,
//     tabIconDefault: '#ccc',
//     tabIconSelected: tintColorDark,
//   },
// };



const tintColorLight = '#fd4a12';
const tintColorDark = '#fd4a12';

export default {
  light: {
    text: '#1a1a1a',          // dark gray text for readability
    background: '#ffffff',    // white background
    tint: tintColorLight,     // main accent color
    tabIconDefault: '#b0b0b0',// light gray for unselected icons
    tabIconSelected: tintColorLight, // selected icon matches accent
    buttonHover: '#ff6a35',  // optional hover or secondary accent
  },
  dark: {
    text: '#e0e0e0',          // light gray text for dark background
    background: '#121212',    // dark gray background
    tint: tintColorDark,      // main accent color
    tabIconDefault: '#777777',// medium gray for unselected icons
    tabIconSelected: tintColorDark,  // selected icon matches accent
    buttonHover: '#ff704d',   // optional hover or secondary accent
  },
};
