import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
  roles?: string[]; // Added roles property
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Accueil',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Accueil',
        type: 'item',
        classes: 'nav-item',
        url: '/default',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'page',
    title: 'Espace EEP',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      
        {
          id: 'typography',
          title: 'Dépot de docs.',
          type: 'item',
          classes: 'nav-item',
          url: '/upload-document',
          icon: 'ti ti-typography'
        },
        {
          id: 'color',
          title: 'Coordonnées',
          type: 'item',
          classes: 'nav-item',
          url: '/blank',
          icon: 'ti ti-brush'
        }
      
    ]
  },
  {
    id: 'elements',
    title: 'Espace AGENT',
    type: 'group',
    icon: 'icon-navigation',
    children: [

      {
        id: 'Documents',
        title: 'Documents',
        type: 'collapse',
        icon: 'ti ti-vocabulary',
        children: [
          {
            id: 'en attente',
            title: 'En attente',
            type: 'item',
            url: '/waiting-list',
            breadcrumbs: false
          },
          {
            id: 'validated',
            title: 'Validés',
            type: 'item',
            url: '/validated-list',
            breadcrumbs: false
          },
          {
            id: 'nonvalidated',
            title: 'Non validés',
            type: 'item',
            url: '/non-validated-list',
            breadcrumbs: false
          },
        ]
      },
      {
        id: 'eep',
        title: 'Liste des EEPs',
        type: 'collapse',
        icon: 'ti ti-key',
        children: [
          {
            id: 'actifs',
            title: 'Actifs',
            type: 'item',
            url: '/eep-active',
            breadcrumbs: false
          },
          {
            id: 'old',
            title: 'Antérieurs',
            type: 'item',
            url: '/eep-old',
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'sample-page',
        title: 'Créer EEP',
        type: 'item',
        url: '/create-eep',
        classes: 'nav-item',
        icon: 'ti ti-brand-chrome'
      }
    ]
  },
  
];

@Injectable()
export class NavigationService {
  private userRole: string; // Assume this holds the current user's role

  constructor() {
    // You should set this from your authentication service
    this.userRole = 'EEP'; // For demonstration, set the user role here
  }

  get() {
    return this.filterNavigationItems(NavigationItems);
  }

  private filterNavigationItems(items: NavigationItem[]): NavigationItem[] {
    return items.map(item => {
      if (item.children) {
        item.children = this.filterNavigationItems(item.children);
      }
      // Check if the item has a roles property and if the user has the required role
      if (item.roles && !item.roles.includes(this.userRole)) {
        return null; // Exclude this item if the role doesn't match
      }
      return item;
    }).filter(Boolean); // Remove null items
  }
  
}
