// Angular import
import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationService, NavigationItem } from './navigation'; // Update the import path as needed

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  // public props
  @Output() NavCollapsedMob = new EventEmitter();
  navCollapsedMob = window.innerWidth;
  windowWidth: number;
  navigationItems: NavigationItem[] = []; // To hold filtered navigation items

  // Constructor
  constructor(private navigationService: NavigationService) {
    this.navigationItems = this.navigationService.get(); // Fetch navigation items
  }

  // public method
  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }
}
