import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ChartExportFormat = 'csv' | 'png' | 'svg' | 'json';

export interface ChartToolbarEvent {
  action: 'export' | 'fullscreen' | 'toggle-table' | 'refresh' | 'share';
  format?: ChartExportFormat;
}

@Component({
  selector: 'app-chart-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
      <!-- Title -->
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {{ title }}
      </h3>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <!-- Export Dropdown -->
        <div class="relative" #exportDropdown>
          <button
            (click)="toggleExportMenu()"
            class="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center gap-1"
            [attr.aria-label]="'Export chart'"
            [attr.aria-expanded]="showExportMenu"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>

          <!-- Export Menu -->
          @if (showExportMenu) {
            <div class="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
              <button
                (click)="export('csv')"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-smooth flex items-center gap-2"
              >
                <span class="text-base">📊</span>
                <span>Export CSV</span>
              </button>
              <button
                (click)="export('png')"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-smooth flex items-center gap-2"
              >
                <span class="text-base">🖼️</span>
                <span>Export PNG</span>
              </button>
              <button
                (click)="export('json')"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-smooth flex items-center gap-2"
              >
                <span class="text-base">📄</span>
                <span>Export JSON</span>
              </button>
            </div>
          }
        </div>

        <!-- Toggle Data Table -->
        @if (showTableToggle) {
          <button
            (click)="toggleTable()"
            [ngClass]="{
              'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400': isTableView
            }"
            class="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500"
            [attr.aria-label]="isTableView ? 'Show chart view' : 'Show table view'"
            [attr.aria-pressed]="isTableView"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </button>
        }

        <!-- Fullscreen -->
        @if (showFullscreen) {
          <button
            (click)="toggleFullscreen()"
            [ngClass]="{
              'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400': isFullscreen
            }"
            class="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500"
            [attr.aria-label]="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
            [attr.aria-pressed]="isFullscreen"
          >
            @if (isFullscreen) {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            } @else {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            }
          </button>
        }

        <!-- Refresh -->
        @if (showRefresh) {
          <button
            (click)="refresh()"
            class="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500"
            [attr.aria-label]="'Refresh chart data'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        }

        <!-- Share -->
        @if (showShare) {
          <button
            (click)="share()"
            class="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500"
            [attr.aria-label]="'Share chart'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
          </button>
        }
      </div>
    </div>
  `,
  styles: [],
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class ChartToolbarComponent {
  @Input() title: string = 'Chart';
  @Input() showTableToggle: boolean = true;
  @Input() showFullscreen: boolean = true;
  @Input() showRefresh: boolean = false;
  @Input() showShare: boolean = false;
  @Input() isTableView: boolean = false;
  @Input() isFullscreen: boolean = false;

  @Output() toolbarAction = new EventEmitter<ChartToolbarEvent>();

  showExportMenu = false;

  toggleExportMenu(): void {
    this.showExportMenu = !this.showExportMenu;
  }

  export(format: ChartExportFormat): void {
    this.showExportMenu = false;
    this.toolbarAction.emit({ action: 'export', format });
  }

  toggleTable(): void {
    this.toolbarAction.emit({ action: 'toggle-table' });
  }

  toggleFullscreen(): void {
    this.toolbarAction.emit({ action: 'fullscreen' });
  }

  refresh(): void {
    this.toolbarAction.emit({ action: 'refresh' });
  }

  share(): void {
    this.toolbarAction.emit({ action: 'share' });
  }

  onDocumentClick(event: Event): void {
    // Close export menu when clicking outside
    const target = event.target as HTMLElement;
    if (!target.closest('button[aria-label="Export chart"]') && !target.closest('.absolute')) {
      this.showExportMenu = false;
    }
  }
}
