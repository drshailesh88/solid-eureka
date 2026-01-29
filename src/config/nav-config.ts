import { NavItem } from '@/types';

/**
 * EMR Navigation Configuration
 *
 * Navigation items for the prescription EMR application.
 */
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Patients',
    url: '/dashboard/patients',
    icon: 'user',
    isActive: false,
    shortcut: ['p', 'p'],
    items: [
      {
        title: 'All Patients',
        url: '/dashboard/patients',
        icon: 'users'
      },
      {
        title: 'New Patient',
        url: '/dashboard/patients/new',
        icon: 'userPlus',
        shortcut: ['n', 'p']
      }
    ]
  },
  {
    title: 'Quick Actions',
    url: '#',
    icon: 'zap',
    isActive: true,
    items: [
      {
        title: 'New Visit',
        url: '/dashboard/quick/visit',
        icon: 'filePlus',
        shortcut: ['n', 'v']
      },
      {
        title: 'Upload Document',
        url: '/dashboard/quick/upload',
        icon: 'upload',
        shortcut: ['u', 'd']
      }
    ]
  },
  {
    title: 'Templates',
    url: '/dashboard/templates',
    icon: 'fileTemplate',
    isActive: false,
    shortcut: ['t', 't'],
    items: [
      {
        title: 'Prescription Templates',
        url: '/dashboard/templates/prescription',
        icon: 'pill'
      },
      {
        title: 'Specialty Presets',
        url: '/dashboard/templates/specialty',
        icon: 'stethoscope'
      }
    ]
  },
  {
    title: 'Settings',
    url: '#',
    icon: 'settings',
    isActive: true,
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'profile',
        shortcut: ['s', 'p']
      },
      {
        title: 'Clinic Settings',
        url: '/dashboard/settings/clinic',
        icon: 'building'
      },
      {
        title: 'Prescription Header',
        url: '/dashboard/settings/header',
        icon: 'fileText'
      }
    ]
  }
];
