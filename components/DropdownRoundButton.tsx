import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { getColors } from '../styles/global_styles';

export default function DropdownRoundButton(props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useColorScheme();
  const colors = getColors(theme);

  return(
    <View style={styles.overlay}>
      {menuOpen && (
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuOpen(false)} />
          <View style={[styles.menu, { backgroundColor: colors.white }]}> 
            {props.elements.map((element, index) => { return (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { borderBottomColor: colors.gray }]}
                onPress={() => {
                  setMenuOpen(false);
                  if (element.callback) element.callback();
                }}
              >
                <Text style={[styles.menuItemText, { color: colors.black }]}>{element.label ?? ''}</Text>
              </TouchableOpacity>
            )})}
          </View>
        </View>
      )}
      
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.magenta.accent }]}
        onPress={() => setMenuOpen((value) => !value)}
        activeOpacity={0.9}
      >
        <Text style={[styles.fabText, { color: colors.white }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 30,
    paddingBottom:110,
    zIndex: 10,
  },
  menu: {
    overflow:'hidden',
    width: 220,
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 50,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  fabText: {
    textAlign:'center',
    fontSize: 45,
    fontWeight: '300',
    height:'100%'
  },
});