import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Filters } from '../../types/models';

export interface SavedFilter {
  id: string;
  name: string;
  filters: Filters;
  createdAt: Date;
  isDefault?: boolean;
}

@Component({
  selector: 'app-saved-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative" #savedFiltersContainer>
      <!-- Trigger Button -->
      <button
        (click)="toggleMenu()"
        class="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-smooth"
        [attr.aria-label]="'Saved filter presets'"
        [attr.aria-expanded]="showMenu"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
        </svg>
        <span class="font-medium">
          {{ currentFilterName || 'Saved Filters' }}
        </span>
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>

      <!-- Dropdown Menu -->
      @if (showMenu) {
        <div class="absolute z-[100] mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 animate-scale-in">
          <!-- Saved Filters List -->
          <div class="p-3 max-h-80 overflow-y-auto">
            @if (savedFilters.length === 0) {
              <!-- Empty State -->
              <div class="py-8 text-center">
                <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
                <p class="text-sm text-gray-600 dark:text-gray-400">No saved filters yet</p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">Apply filters and save them below</p>
              </div>
            } @else {
              @for (filter of savedFilters; track filter.id) {
                <div
                  class="group flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-smooth cursor-pointer"
                  [ngClass]="{
                    'bg-primary-50 dark:bg-primary-900/20': currentFilterId === filter.id
                  }"
                >
                  <!-- Filter Name -->
                  <button
                    (click)="loadFilter(filter)"
                    class="flex-1 text-left focus:outline-none"
                  >
                    <div class="flex items-center gap-2">
                      @if (filter.isDefault) {
                        <svg class="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      }
                      <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {{ filter.name }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {{ getFilterDescription(filter) }}
                    </p>
                  </button>

                  <!-- Actions -->
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    @if (!filter.isDefault) {
                      <button
                        (click)="setAsDefault(filter); $event.stopPropagation()"
                        class="p-1.5 text-gray-400 hover:text-yellow-500 rounded transition-smooth"
                        title="Set as default"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                        </svg>
                      </button>
                    }
                    <button
                      (click)="deleteFilter(filter); $event.stopPropagation()"
                      class="p-1.5 text-gray-400 hover:text-red-500 rounded transition-smooth"
                      title="Delete filter"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              }
            }
          </div>

          <!-- Save Current Filter -->
          @if (!showSaveInput) {
            <div class="p-3 border-t border-gray-200 dark:border-gray-700">
              <button
                (click)="showSaveInput = true"
                class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>Save Current Filters</span>
              </button>
            </div>
          } @else {
            <div class="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <input
                type="text"
                [(ngModel)]="newFilterName"
                (keydown.enter)="saveCurrentFilters()"
                (keydown.escape)="cancelSave()"
                placeholder="Filter name..."
                class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-smooth"
                autofocus
              />
              <div class="flex gap-2">
                <button
                  (click)="cancelSave()"
                  class="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-smooth"
                >
                  Cancel
                </button>
                <button
                  (click)="saveCurrentFilters()"
                  [disabled]="!newFilterName.trim()"
                  class="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-smooth"
                >
                  Save
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [],
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class SavedFiltersComponent implements OnInit {
  @Input() currentFilters!: Filters;
  @Output() filterLoad = new EventEmitter<Filters>();
  @Output() filterSave = new EventEmitter<SavedFilter>();
  @Output() filterDelete = new EventEmitter<string>();

  showMenu = false;
  showSaveInput = false;
  newFilterName = '';
  savedFilters: SavedFilter[] = [];
  currentFilterId: string | null = null;
  currentFilterName: string | null = null;

  ngOnInit() {
    this.loadSavedFilters();
  }

  private loadSavedFilters(): void {
    const saved = localStorage.getItem('savedFilters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.savedFilters = parsed.map((f: any) => ({
          ...f,
          createdAt: new Date(f.createdAt)
        }));
      } catch (e) {
        console.error('Failed to load saved filters:', e);
        this.savedFilters = [];
      }
    }
  }

  private saveSavedFilters(): void {
    localStorage.setItem('savedFilters', JSON.stringify(this.savedFilters));
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
    if (!this.showMenu) {
      this.showSaveInput = false;
      this.newFilterName = '';
    }
  }

  loadFilter(filter: SavedFilter): void {
    this.currentFilterId = filter.id;
    this.currentFilterName = filter.name;
    this.filterLoad.emit(filter.filters);
    this.showMenu = false;
  }

  saveCurrentFilters(): void {
    if (!this.newFilterName.trim()) return;

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: this.newFilterName.trim(),
      filters: { ...this.currentFilters },
      createdAt: new Date(),
      isDefault: this.savedFilters.length === 0
    };

    this.savedFilters.push(newFilter);
    this.saveSavedFilters();
    this.filterSave.emit(newFilter);

    this.currentFilterId = newFilter.id;
    this.currentFilterName = newFilter.name;
    this.newFilterName = '';
    this.showSaveInput = false;
    this.showMenu = false;
  }

  setAsDefault(filter: SavedFilter): void {
    this.savedFilters.forEach(f => f.isDefault = false);
    filter.isDefault = true;
    this.saveSavedFilters();
  }

  deleteFilter(filter: SavedFilter): void {
    if (confirm(`Delete filter "${filter.name}"?`)) {
      this.savedFilters = this.savedFilters.filter(f => f.id !== filter.id);
      this.saveSavedFilters();
      this.filterDelete.emit(filter.id);

      if (this.currentFilterId === filter.id) {
        this.currentFilterId = null;
        this.currentFilterName = null;
      }

      // If deleted filter was default, make first one default
      if (filter.isDefault && this.savedFilters.length > 0) {
        this.savedFilters[0].isDefault = true;
        this.saveSavedFilters();
      }
    }
  }

  cancelSave(): void {
    this.showSaveInput = false;
    this.newFilterName = '';
  }

  getFilterDescription(filter: SavedFilter): string {
    const parts: string[] = [];
    const f = filter.filters;

    if (f.departments.length > 0) {
      parts.push(`${f.departments.length} dept${f.departments.length > 1 ? 's' : ''}`);
    }
    if (f.regions.length > 0) {
      parts.push(`${f.regions.length} region${f.regions.length > 1 ? 's' : ''}`);
    }
    if (f.statuses.length > 0) {
      parts.push(`${f.statuses.length} status${f.statuses.length > 1 ? 'es' : ''}`);
    }
    if (f.search) {
      parts.push('search');
    }

    return parts.length > 0 ? parts.join(', ') : 'All projects';
  }

  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-saved-filters')) {
      this.showMenu = false;
      this.showSaveInput = false;
      this.newFilterName = '';
    }
  }
}
