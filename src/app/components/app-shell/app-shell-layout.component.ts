import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

export type NavigationItem = {
	id: string;
	label: string;
	icon: string;
	active: boolean;
};

@Component({
	selector: 'app-shell-layout',
	standalone: true,
	imports: [CommonModule],
	template: `
    <!-- Mesh gradient background -->
    <div class="mesh-gradient-bg"></div>

    <!-- App Shell: 4-panel layout -->
    <div class="app-shell">
      <!-- LEFT: Icon Rail Sidebar -->
      <aside class="icon-rail">
        <div class="icon-rail-content">
          <!-- Logo/Brand -->
          <div class="icon-rail-logo">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-glow-sm">
              E
            </div>
          </div>

          <!-- Navigation Icons -->
          <nav class="icon-rail-nav">
            @for (item of navItems(); track item.id) {
              <button
                (click)="setActiveNav(item.id)"
                [class]="item.active ? 'icon-btn icon-btn-active' : 'icon-btn'"
                [attr.aria-label]="item.label"
                [attr.title]="item.label"
              >
                <span class="text-xl">{{ item.icon }}</span>
              </button>
            }
          </nav>

          <!-- Bottom Actions -->
          <div class="icon-rail-bottom">
            <!-- Dark Mode Toggle -->
            <button
              (click)="toggleDarkMode()"
              class="icon-btn"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              @if (isDarkMode()) {
                <span class="text-xl">🌙</span>
              } @else {
                <span class="text-xl">☀️</span>
              }
            </button>

            <!-- Settings -->
            <button
              class="icon-btn"
              aria-label="Settings"
              title="Settings"
            >
              <span class="text-xl">⚙️</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- MAIN AREA: Header + Content + Insights Panel -->
      <div class="main-area">
        <!-- TOP: Header -->
        <header class="top-header">
          <div class="top-header-content">
            <!-- Left: Page Title + Subtitle -->
            <div class="header-left">
              <div>
                <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {{ pageTitle() }}
                </h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {{ pageSubtitle() }}
                </p>
              </div>

              <!-- Pill Controls -->
              <div class="flex items-center gap-3 ml-8">
                <!-- Date Preset Dropdown -->
                <div class="relative">
                  <button
                    (click)="toggleDateDropdown()"
                    class="btn-pill btn-pill-secondary"
                  >
                    <span>📅</span>
                    <span>{{ selectedDatePreset() }}</span>
                    <span>▼</span>
                  </button>

                  @if (showDateDropdown()) {
                    <div class="dropdown-menu">
                      @for (preset of datePresets; track preset) {
                        <button
                          (click)="selectDatePreset(preset)"
                          class="dropdown-item"
                        >
                          {{ preset }}
                        </button>
                      }
                    </div>
                  }
                </div>

                <!-- Filters Button -->
                <button
                  (click)="toggleFiltersPanel()"
                  class="btn-pill btn-pill-secondary"
                >
                  <span>🔍</span>
                  <span>Filters</span>
                  @if (activeFiltersCount() > 0) {
                    <span class="badge badge-info">{{ activeFiltersCount() }}</span>
                  }
                </button>
              </div>
            </div>

            <!-- Center: Search Bar -->
            <div class="header-center">
              <div class="relative max-w-md w-full">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search anything..."
                  class="search-bar pl-12"
                  [value]="searchQuery()"
                  (input)="onSearchInput($event)"
                />
              </div>
            </div>

            <!-- Right: Notifications + User Avatar -->
            <div class="header-right">
              <!-- Notifications -->
              <button class="icon-btn relative" aria-label="Notifications" title="Notifications">
                <span class="text-xl">🔔</span>
                @if (notificationCount() > 0) {
                  <span class="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {{ notificationCount() }}
                  </span>
                }
              </button>

              <!-- User Avatar -->
              <button class="flex items-center gap-3 hover:opacity-80 transition-opacity" aria-label="User profile">
                <div class="text-right hidden lg:block">
                  <div class="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    John Doe
                  </div>
                  <div class="text-xs text-slate-500 dark:text-slate-400">
                    Admin
                  </div>
                </div>
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-soft">
                  JD
                </div>
              </button>
            </div>
          </div>
        </header>

        <!-- CONTENT AREA: Main + Insights Panel -->
        <div class="content-area">
          <!-- CENTER: Main Content -->
          <main class="main-content">
            <ng-content></ng-content>
          </main>

          <!-- RIGHT: Insights Panel -->
          <aside class="insights-panel">
            <!-- Illustration Card -->
            <div class="floating-card whitespace-lg mb-6">
              <div class="w-full h-40 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-3xl flex items-center justify-center mb-4">
                <span class="text-6xl">📊</span>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Website Redesign
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Q1 2026 milestone project
              </p>
              <button class="btn-pill btn-pill-primary w-full">
                <span>View Details</span>
                <span>→</span>
              </button>
            </div>

            <!-- Mini Calendar -->
            <div class="floating-card whitespace-lg mb-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">
                  January 2026
                </h3>
                <div class="flex gap-2">
                  <button class="w-6 h-6 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-smooth">
                    ←
                  </button>
                  <button class="w-6 h-6 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-smooth">
                    →
                  </button>
                </div>
              </div>
              <div class="mini-calendar">
                <!-- Calendar grid -->
                <div class="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                  @for (day of ['S', 'M', 'T', 'W', 'T', 'F', 'S']; track day) {
                    <div class="text-slate-500 dark:text-slate-400 font-semibold">{{ day }}</div>
                  }
                </div>
                <div class="grid grid-cols-7 gap-1 text-center text-xs">
                  @for (date of calendarDates; track date) {
                    <button
                      [class]="date === 6 ? 'calendar-date calendar-date-active' : 'calendar-date'"
                    >
                      {{ date }}
                    </button>
                  }
                </div>
              </div>
            </div>

            <!-- Upcoming Items -->
            <div class="floating-card whitespace-lg">
              <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
                Upcoming
              </h3>
              <div class="space-y-3">
                @for (item of upcomingItems; track item.id) {
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <span class="text-sm">{{ item.icon }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {{ item.title }}
                      </div>
                      <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {{ item.time }}
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <!-- Filters Slideout Panel (if open) -->
    @if (showFiltersPanel()) {
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
        (click)="toggleFiltersPanel()"
      >
        <div
          class="fixed right-0 top-0 h-full w-96 bg-white dark:bg-slate-900 shadow-soft-xl animate-slide-in"
          (click)="$event.stopPropagation()"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">
                Filters
              </h2>
              <button
                (click)="toggleFiltersPanel()"
                class="icon-btn"
                aria-label="Close filters"
              >
                <span class="text-lg">✕</span>
              </button>
            </div>
            <ng-content select="[slot='filters']"></ng-content>
          </div>
        </div>
      </div>
    }
  `,
	styles: [`
    .app-shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    /* Icon Rail Sidebar */
    .icon-rail {
      width: 80px;
      background: var(--bg-card);
      border-right: 1px solid var(--border-subtle);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      z-index: 40;
    }

    .icon-rail-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 20px 16px;
    }

    .icon-rail-logo {
      display: flex;
      justify-content: center;
      margin-bottom: 32px;
    }

    .icon-rail-nav {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
    }

    .icon-rail-bottom {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 20px;
      border-top: 1px solid var(--border-subtle);
    }

    /* Main Area */
    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Top Header */
    .top-header {
      height: 80px;
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-subtle);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      padding: 0 32px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      z-index: 30;
    }

    .top-header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 32px;
    }

    .header-left {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .header-center {
      display: flex;
      justify-content: center;
      flex: 1;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      justify-content: flex-end;
    }

    /* Content Area */
    .content-area {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
    }

    /* Insights Panel */
    .insights-panel {
      width: 320px;
      background: var(--bg-primary);
      border-left: 1px solid var(--border-subtle);
      overflow-y: auto;
      padding: 24px;
      flex-shrink: 0;
    }

    /* Dropdown Menu */
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      min-width: 200px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      box-shadow: var(--shadow-soft-xl);
      padding: 8px;
      z-index: 50;
      animation: slideUp 0.2s ease-out;
    }

    .dropdown-item {
      display: block;
      width: 100%;
      padding: 10px 16px;
      text-align: left;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      background: transparent;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .dropdown-item:hover {
      background: var(--bg-tertiary);
    }

    /* Calendar */
    .calendar-date {
      width: 100%;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: var(--text-primary);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .calendar-date:hover {
      background: var(--bg-tertiary);
    }

    .calendar-date-active {
      background: var(--gradient-primary);
      color: white;
      font-weight: 700;
    }

    /* Responsive */
    @media (max-width: 1280px) {
      .insights-panel {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .icon-rail {
        width: 64px;
      }

      .top-header {
        padding: 0 16px;
      }

      .header-left,
      .header-center {
        flex: none;
      }

      .header-center .max-w-md {
        display: none;
      }

      .main-content {
        padding: 16px;
      }
    }
  `]
})
export class AppShellLayoutComponent {
	themeService = new ThemeService();

	// Navigation
	navItems = signal<NavigationItem[]>([
		{ id: 'overview', label: 'Overview', icon: '🏠', active: true },
		{ id: 'projects', label: 'Projects', icon: '📁', active: false },
		{ id: 'workflows', label: 'Workflows', icon: '⚡', active: false },
		{ id: 'departments', label: 'Departments', icon: '🏢', active: false },
		{ id: 'analytics', label: 'Analytics', icon: '📊', active: false },
	]);

	// State
	isDarkMode = signal(this.themeService.isDarkMode());
	pageTitle = signal('Overview');
	pageSubtitle = signal('Real-time operations dashboard');
	searchQuery = signal('');
	selectedDatePreset = signal('Last 30 days');
	showDateDropdown = signal(false);
	showFiltersPanel = signal(false);
	activeFiltersCount = signal(0);
	notificationCount = signal(3);

	datePresets = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'YTD', 'All Time'];

	calendarDates = Array.from({ length: 31 }, (_, i) => i + 1);

	upcomingItems = [
		{ id: '1', icon: '📅', title: 'Q1 Review Meeting', time: 'Today, 2:00 PM' },
		{ id: '2', icon: '🎯', title: 'Sprint Planning', time: 'Tomorrow, 10:00 AM' },
		{ id: '3', icon: '📊', title: 'Milestone Deadline', time: 'Jan 15, 2026' },
	];

	setActiveNav(id: string): void {
		this.navItems.update(items =>
			items.map(item => ({ ...item, active: item.id === id }))
		);

		// Update page title based on active nav
		const activeItem = this.navItems().find(item => item.id === id);
		if (activeItem) {
			this.pageTitle.set(activeItem.label);
		}
	}

	toggleDarkMode(): void {
		this.themeService.toggleDarkMode();
		this.isDarkMode.set(this.themeService.isDarkMode());
	}

	toggleDateDropdown(): void {
		this.showDateDropdown.update(v => !v);
	}

	selectDatePreset(preset: string): void {
		this.selectedDatePreset.set(preset);
		this.showDateDropdown.set(false);
	}

	toggleFiltersPanel(): void {
		this.showFiltersPanel.update(v => !v);
	}

	onSearchInput(event: Event): void {
		const value = (event.target as HTMLInputElement).value;
		this.searchQuery.set(value);
	}
}
