import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  iconFocused: IoniconsName;
  iconUnfocused: IoniconsName;
}

const TABS: TabConfig[] = [
  {
    name: 'index',
    title: 'Learn',
    iconFocused: 'home',
    iconUnfocused: 'home-outline',
  },
  {
    name: 'leaderboard',
    title: 'Ranks',
    iconFocused: 'trophy',
    iconUnfocused: 'trophy-outline',
  },
  {
    name: 'profile',
    title: 'Profile',
    iconFocused: 'person',
    iconUnfocused: 'person-outline',
  },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBarBackground,
          borderTopColor: Colors.tabBarBorder,
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 60,
        },
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '700',
          marginTop: -2,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.iconUnfocused}
                size={size ?? 24}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
