import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  preset?: string;
}

export interface DateRangePreset {
  label: string;
  value: string;
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative" #datePickerContainer>
      <!-- Trigger Button -->
      <button
        (click)="togglePicker($event)"
        class="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-smooth"
        [attr.aria-label]="'Select date range'"
        [attr.aria-expanded]="showPicker"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span class="font-medium">{{ getDisplayLabel() }}</span>
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>

      <!-- Dropdown Panel -->
      @if (showPicker) {
        <div (click)="$event.stopPropagation()" class="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[100] animate-scale-in">
          <!-- Presets -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Quick Select
            </label>
            <div class="grid grid-cols-2 gap-2">
              @for (preset of presets; track preset.value) {
                <button
                  (click)="selectPreset(preset)"
                  [ngClass]="{
                    'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-500': selectedRange?.preset === preset.value,
                    'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600': selectedRange?.preset !== preset.value
                  }"
                  class="px-3 py-2 text-xs font-medium border rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {{ preset.label }}
                </button>
              }
            </div>
          </div>

          <!-- Custom Date Inputs -->
          <div class="p-4 space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                [(ngModel)]="customStart"
                [max]="customEnd || today"
                class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-smooth"
                aria-label="Start date"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                [(ngModel)]="customEnd"
                [min]="customStart"
                [max]="today"
                class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-smooth"
                aria-label="End date"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button
              (click)="clearSelection()"
              class="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-smooth focus:outline-none"
            >
              Clear
            </button>
            <div class="flex gap-2">
              <button
                (click)="cancelSelection()"
                class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-smooth focus:outline-none"
              >
                Cancel
              </button>
              <button
                (click)="applyCustomRange()"
                [disabled]="!customStart || !customEnd"
                class="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [],
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class DateRangePickerComponent implements OnInit {
  @Input() initialRange?: DateRange;
  @Output() rangeChange = new EventEmitter<DateRange>();

  showPicker = false;
  selectedRange: DateRange | null = null;
  customStart = '';
  customEnd = '';
  today = '';

  presets: DateRangePreset[] = [];

  ngOnInit() {
    this.initializePresets();
    this.today = this.formatDateForInput(new Date());

    if (this.initialRange) {
      this.selectedRange = this.initialRange;
      this.customStart = this.formatDateForInput(this.initialRange.startDate);
      this.customEnd = this.formatDateForInput(this.initialRange.endDate);
    } else {
      // Default to Last 30 days
      this.selectPreset(this.presets[1]);
    }
  }

  private initializePresets(): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    this.presets = [
      {
        label: 'Today',
        value: 'today',
        startDate: new Date(today),
        endDate: new Date(today)
      },
      {
        label: 'Last 7 Days',
        value: 'last-7-days',
        startDate: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000),
        endDate: new Date(today)
      },
      {
        label: 'Last 30 Days',
        value: 'last-30-days',
        startDate: new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000),
        endDate: new Date(today)
      },
      {
        label: 'Last 90 Days',
        value: 'last-90-days',
        startDate: new Date(today.getTime() - 89 * 24 * 60 * 60 * 1000),
        endDate: new Date(today)
      },
      {
        label: 'This Month',
        value: 'this-month',
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(today)
      },
      {
        label: 'Last Month',
        value: 'last-month',
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        endDate: new Date(now.getFullYear(), now.getMonth(), 0)
      },
      {
        label: 'This Quarter',
        value: 'this-quarter',
        startDate: this.getQuarterStart(now),
        endDate: new Date(today)
      },
      {
        label: 'Year to Date',
        value: 'ytd',
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: new Date(today)
      }
    ];
  }

  private getQuarterStart(date: Date): Date {
    const quarter = Math.floor(date.getMonth() / 3);
    return new Date(date.getFullYear(), quarter * 3, 1);
  }

  togglePicker(event: Event): void {
    event.stopPropagation();
    this.showPicker = !this.showPicker;
    console.log('Date picker toggled:', this.showPicker);
  }

  selectPreset(preset: DateRangePreset): void {
    this.selectedRange = {
      startDate: preset.startDate,
      endDate: preset.endDate,
      preset: preset.value
    };
    this.customStart = this.formatDateForInput(preset.startDate);
    this.customEnd = this.formatDateForInput(preset.endDate);
    this.rangeChange.emit(this.selectedRange);
    this.showPicker = false;
  }

  applyCustomRange(): void {
    if (!this.customStart || !this.customEnd) return;

    this.selectedRange = {
      startDate: new Date(this.customStart),
      endDate: new Date(this.customEnd),
      preset: 'custom'
    };
    this.rangeChange.emit(this.selectedRange);
    this.showPicker = false;
  }

  clearSelection(): void {
    // Reset to default (Last 30 days)
    this.selectPreset(this.presets[2]);
  }

  cancelSelection(): void {
    // Revert to previously selected range
    if (this.selectedRange) {
      this.customStart = this.formatDateForInput(this.selectedRange.startDate);
      this.customEnd = this.formatDateForInput(this.selectedRange.endDate);
    }
    this.showPicker = false;
  }

  getDisplayLabel(): string {
    if (!this.selectedRange) return 'Select Date Range';

    if (this.selectedRange.preset && this.selectedRange.preset !== 'custom') {
      const preset = this.presets.find(p => p.value === this.selectedRange!.preset);
      return preset ? preset.label : 'Custom Range';
    }

    // Format custom range
    const start = this.formatDateDisplay(this.selectedRange.startDate);
    const end = this.formatDateDisplay(this.selectedRange.endDate);
    return `${start} - ${end}`;
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatDateDisplay(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  }

  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-date-range-picker')) {
      this.showPicker = false;
    }
  }
}
