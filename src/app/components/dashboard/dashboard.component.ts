import { Component, OnInit, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, Filters, KPI, Department, Region, ProjectStatus, Activity } from '../../types/models';
import { DemoDataService } from '../../services/demo-data.service';
import { ExportService } from '../../services/export.service';
import { ToastService } from '../../services/toast.service';
import { ThemeService } from '../../services/theme.service';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { KpiCardComponent } from '../kpi-card/kpi-card.component';
import { FiltersBarComponent } from '../filters-bar/filters-bar.component';
import { ChartsPanelComponent } from '../charts-panel/charts-panel.component';
import { ProjectsTableComponent } from '../projects-table/projects-table.component';
import { ProjectDrawerComponent } from '../project-drawer/project-drawer.component';
import { ActivityFeedComponent } from '../activity-feed/activity-feed.component';
import { AiInsightsPanelComponent, Insight } from '../ai-insights-panel/ai-insights-panel.component';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [
		CommonModule,
		SkeletonLoaderComponent,
		KpiCardComponent,
		FiltersBarComponent,
		ChartsPanelComponent,
		ProjectsTableComponent,
		ProjectDrawerComponent,
		ActivityFeedComponent,
		AiInsightsPanelComponent
	],
	template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <!-- Navigation -->
      <nav class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 no-print">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div>
                <h1 class="text-xl font-bold gradient-text">Enterprise Dashboard</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">Project Management & Analytics</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <!-- Export Buttons -->
              <button
                (click)="exportCSV()"
                class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center gap-2"
                aria-label="Export to CSV"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                CSV
              </button>

              <button
                (click)="exportJSON()"
                class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center gap-2"
                aria-label="Export to JSON"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                JSON
              </button>

              <button
                (click)="print()"
                class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center gap-2"
                aria-label="Print dashboard"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                Print
              </button>

              <!-- Dark Mode Toggle -->
              <button
                (click)="toggleDarkMode()"
                class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500"
                [attr.aria-label]="themeService.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
              >
                @if (themeService.isDarkMode()) {
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                  </svg>
                } @else {
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                  </svg>
                }
              </button>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex gap-1 border-b border-gray-200 dark:border-gray-700 -mb-px">
            @for (tab of tabs; track tab.id) {
              <button
                (click)="activeTab.set(tab.id)"
                [class.border-primary-500]="activeTab() === tab.id"
                [class.text-primary-600]="activeTab() === tab.id"
                [class.dark:text-primary-400]="activeTab() === tab.id"
                [class.border-transparent]="activeTab() !== tab.id"
                [class.text-gray-600]="activeTab() !== tab.id"
                [class.dark:text-gray-400]="activeTab() !== tab.id"
                class="px-4 py-3 text-sm font-medium border-b-2 hover:text-primary-600 dark:hover:text-primary-400 transition-smooth focus:outline-none"
                [attr.aria-selected]="activeTab() === tab.id"
                role="tab"
              >
                {{ tab.label }}
              </button>
            }
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        @if (isLoading()) {
          <!-- Loading Skeletons -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (i of [1,2,3,4]; track i) {
              <app-skeleton-loader type="kpi"></app-skeleton-loader>
            }
          </div>
          <app-skeleton-loader type="chart"></app-skeleton-loader>
          <app-skeleton-loader type="table"></app-skeleton-loader>
        } @else {
          <!-- Filters (show on all tabs except overview and departments) -->
          @if (activeTab() !== 'overview' && activeTab() !== 'departments') {
            <div class="animate-slide-up relative z-30" style="overflow: visible;">
              <app-filters-bar
                [filters]="filters()"
                [availableDepartments]="availableDepartments"
                [availableRegions]="availableRegions"
                [availableStatuses]="availableStatuses"
                (filtersChange)="onFiltersChange($event)"
              ></app-filters-bar>
            </div>
          }

          <!-- KPI Cards (show only on overview and analytics tabs) -->
          @if (activeTab() === 'overview' || activeTab() === 'analytics') {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              @for (kpi of kpis(); track kpi.label) {
                <app-kpi-card [kpi]="kpi"></app-kpi-card>
              }
            </div>
          }

          @if (activeTab() === 'overview') {
            <!-- Overview Page - Activity Feed + AI Insights -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
              <!-- Activity Feed -->
              <app-activity-feed
                [activities]="recentActivities()"
                [maxItems]="10"
                (activityClick)="onActivityClick($event)"
                (viewAll)="viewAllActivities()"
              ></app-activity-feed>

              <!-- AI Insights Panel -->
              <app-ai-insights-panel
                [insights]="aiInsights()"
                (actionClick)="onInsightAction($event)"
              ></app-ai-insights-panel>
            </div>

            <!-- Critical Projects Overview -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style="animation-delay: 0.1s;">
              <!-- Critical Projects -->
              <div class="glass-card p-6">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <span>🚨</span>
                  <span>Critical Projects</span>
                </h3>
                <div class="space-y-3">
                  @for (project of criticalProjects(); track project.id) {
                    <div
                      class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-smooth"
                      (click)="openProjectDrawer(project)"
                    >
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ project.name }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ project.id }}</p>
                      </div>
                      <div class="flex-shrink-0 ml-3">
                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300">
                          Risk {{ project.risk }}
                        </span>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Top Performers -->
              <div class="glass-card p-6">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <span>⭐</span>
                  <span>Top Performers</span>
                </h3>
                <div class="space-y-3">
                  @for (project of topPerformers(); track project.id) {
                    <div
                      class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-smooth"
                      (click)="openProjectDrawer(project)"
                    >
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ project.name }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ project.id }}</p>
                      </div>
                      <div class="flex-shrink-0 ml-3">
                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300">
                          Eff. {{ project.efficiency }}
                        </span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          @if (activeTab() === 'analytics') {
            <!-- Analytics Page - Full Charts -->
            <div class="animate-slide-up">
              <app-charts-panel
                [projects]="filteredProjects()"
                [isDarkMode]="themeService.isDarkMode()"
                (projectClick)="openProjectDrawer($event)"
              ></app-charts-panel>
            </div>
          }

          @if (activeTab() === 'projects') {
            <!-- Projects Table -->
            <div class="animate-slide-up">
              <app-projects-table
                [projects]="filteredProjects()"
                (projectSelect)="openProjectDrawer($event)"
              ></app-projects-table>
            </div>
          }

          @if (activeTab() === 'departments') {
            <!-- Department View -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
              @for (dept of availableDepartments; track dept) {
                <div class="glass-card p-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ dept }}</h3>
                  <div class="space-y-3">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">Total Projects</span>
                      <span class="font-semibold">{{ getDepartmentStats(dept).total }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">Avg Risk</span>
                      <span class="font-semibold">{{ getDepartmentStats(dept).avgRisk }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">Avg Efficiency</span>
                      <span class="font-semibold">{{ getDepartmentStats(dept).avgEfficiency }}</span>
                    </div>
                    <button
                      (click)="filterByDepartment(dept)"
                      class="w-full mt-4 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg transition-smooth"
                    >
                      View Projects
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        }
      </main>

      <!-- Project Drawer -->
      <app-project-drawer
        [project]="selectedProject()"
        [isOpen]="isDrawerOpen()"
        (closeDrawer)="closeProjectDrawer()"
        (filterByDept)="filterByDepartment($event)"
        (filterByReg)="filterByRegion($event)"
        (filterByStat)="filterByStatus($event)"
      ></app-project-drawer>
    </div>
  `,
	styles: []
})
export class DashboardComponent implements OnInit {
	private demoDataService = inject(DemoDataService);
	private exportService = inject(ExportService);
	private toastService = inject(ToastService);
	themeService = inject(ThemeService);

	// State
	allProjects = signal<Project[]>([]);
	filters = signal<Filters>({
		departments: [],
		regions: [],
		statuses: [],
		datePreset: 'All',
		search: '',
		maxRisk: 100,
		minReward: 0
	});
	isLoading = signal<boolean>(true);
	selectedProject = signal<Project | null>(null);
	isDrawerOpen = signal<boolean>(false);
	activeTab = signal<string>('overview');

	tabs = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'departments', label: 'Departments' },
		{ id: 'analytics', label: 'Analytics' }
	];

	availableDepartments: Department[] = [];
	availableRegions: Region[] = [];
	availableStatuses: ProjectStatus[] = [];

	// Computed
	filteredProjects = computed(() => {
		let projects = this.allProjects();
		const f = this.filters();

		// Department filter
		if (f.departments.length > 0) {
			projects = projects.filter(p => f.departments.includes(p.department));
		}

		// Region filter
		if (f.regions.length > 0) {
			projects = projects.filter(p => f.regions.includes(p.region));
		}

		// Status filter
		if (f.statuses.length > 0) {
			projects = projects.filter(p => f.statuses.includes(p.status));
		}

		// Search filter
		if (f.search) {
			const search = f.search.toLowerCase();
			projects = projects.filter(p =>
				p.name.toLowerCase().includes(search) ||
				p.id.toLowerCase().includes(search) ||
				p.owner.toLowerCase().includes(search) ||
				p.department.toLowerCase().includes(search) ||
				p.region.toLowerCase().includes(search)
			);
		}

		// Risk filter
		projects = projects.filter(p => p.risk <= f.maxRisk);

		// Reward filter
		projects = projects.filter(p => p.reward >= f.minReward);

		// Date filter
		if (f.datePreset !== 'All') {
			const now = new Date();
			const cutoffDate = new Date();

			if (f.datePreset === 'Last 30 days') {
				cutoffDate.setDate(now.getDate() - 30);
			} else if (f.datePreset === 'Last 90 days') {
				cutoffDate.setDate(now.getDate() - 90);
			} else if (f.datePreset === 'YTD') {
				cutoffDate.setMonth(0, 1);
			}

			projects = projects.filter(p => p.startDate >= cutoffDate);
		}

		return projects;
	});

	kpis = computed(() => {
		const projects = this.filteredProjects();
		const total = projects.length;

		const onTimeCount = projects.filter(p => p.status === 'On Track' || p.delayDays === 0).length;
		const onTimePercent = total > 0 ? (onTimeCount / total * 100).toFixed(1) : '0';

		const totalBudgetAllocated = projects.reduce((sum, p) => sum + p.budgetAllocated, 0);
		const totalBudgetSpent = projects.reduce((sum, p) => sum + p.budgetSpent, 0);
		const budgetUsedPercent = totalBudgetAllocated > 0 ? (totalBudgetSpent / totalBudgetAllocated * 100).toFixed(1) : '0';

		const riskAlerts = projects.filter(p => p.risk > 70).length;

		// Generate sparkline data (last 30 days trend)
		const projectsSparkline = this.generateSparklineData(total, 12.5, 30);
		const onTimeSparkline = this.generateSparklineData(parseFloat(onTimePercent), 5.2, 30);
		const budgetSparkline = this.generateSparklineData(parseFloat(budgetUsedPercent), -2.1, 30);
		const alertsSparkline = this.generateSparklineData(riskAlerts, -8.3, 30);

		return [
			{
				label: 'Active Projects',
				value: total,
				change: 12.5,
				trend: 'up' as const,
				sparklineData: projectsSparkline,
				sparklineColor: '#10b981'
			},
			{
				label: 'On-Time Delivery',
				value: `${onTimePercent}%`,
				change: 5.2,
				trend: 'up' as const,
				sparklineData: onTimeSparkline,
				sparklineColor: '#10b981'
			},
			{
				label: 'Budget Used',
				value: `${budgetUsedPercent}%`,
				change: -2.1,
				trend: 'down' as const,
				sparklineData: budgetSparkline,
				sparklineColor: '#ef4444'
			},
			{
				label: 'Risk Alerts',
				value: riskAlerts,
				change: -8.3,
				trend: 'down' as const,
				sparklineData: alertsSparkline,
				sparklineColor: '#10b981'
			}
		] as KPI[];
	});

	// Recent activities (mock data for now)
	recentActivities = computed((): Activity[] => {
		const projects = this.allProjects();
		if (projects.length === 0) return [];

		const activities: Activity[] = [];
		const now = new Date();

		// Generate mock activities based on project data
		projects.slice(0, 15).forEach((project, index) => {
			const minutesAgo = index * 15 + Math.floor(Math.random() * 10);
			const timestamp = new Date(now.getTime() - minutesAgo * 60000);

			if (project.status === 'Blocked') {
				activities.push({
					id: `act-${index}-1`,
					type: 'status_change',
					projectId: project.id,
					projectName: project.name,
					message: `${project.name} moved to Blocked status`,
					timestamp,
					severity: 'critical'
				});
			} else if (project.progress === 100) {
				activities.push({
					id: `act-${index}-2`,
					type: 'completion',
					projectId: project.id,
					projectName: project.name,
					message: `${project.name} completed successfully`,
					timestamp,
					severity: 'success'
				});
			} else if (project.risk > 80) {
				activities.push({
					id: `act-${index}-3`,
					type: 'alert',
					projectId: project.id,
					projectName: project.name,
					message: `High risk alert for ${project.name}`,
					timestamp,
					severity: 'warning'
				});
			} else if (project.budgetSpent > project.budgetAllocated * 0.95) {
				activities.push({
					id: `act-${index}-4`,
					type: 'budget',
					projectId: project.id,
					projectName: project.name,
					message: `Budget alert: ${project.department} at ${Math.round(project.budgetSpent / project.budgetAllocated * 100)}%`,
					timestamp,
					severity: 'warning'
				});
			}
		});

		return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
	});

	// AI-generated insights (mock data)
	aiInsights = computed((): Insight[] => {
		const projects = this.filteredProjects();
		const insights: Insight[] = [];

		// Insight 1: Critical projects
		const criticalCount = projects.filter(p => p.risk > 70).length;
		if (criticalCount > 0) {
			insights.push({
				id: 'insight-1',
				title: `${criticalCount} projects need immediate attention`,
				description: `Based on risk analysis, ${criticalCount} projects have risk scores above 70 and may require intervention to prevent delays or failures.`,
				severity: criticalCount > 5 ? 'critical' : 'warning',
				category: 'risk',
				actionLabel: 'View Critical Projects',
				actionData: { filter: 'high-risk' },
				confidence: 94
			});
		}

		// Insight 2: Budget trending
		const totalBudgetAllocated = projects.reduce((sum, p) => sum + p.budgetAllocated, 0);
		const totalBudgetSpent = projects.reduce((sum, p) => sum + p.budgetSpent, 0);
		const budgetPercent = totalBudgetAllocated > 0 ? (totalBudgetSpent / totalBudgetAllocated * 100) : 0;

		if (budgetPercent > 90) {
			insights.push({
				id: 'insight-2',
				title: 'Budget utilization exceeds 90%',
				description: `Current spending is at ${budgetPercent.toFixed(1)}% of allocated budget. Consider reviewing project priorities or requesting additional funds.`,
				severity: budgetPercent > 100 ? 'critical' : 'warning',
				category: 'budget',
				actionLabel: 'View Budget Details',
				actionData: { view: 'budget' },
				confidence: 88
			});
		}

		// Insight 3: Delay forecast
		const delayedProjects = projects.filter(p => p.delayDays > 0);
		if (delayedProjects.length > 3) {
			insights.push({
				id: 'insight-3',
				title: `Forecast: ${delayedProjects.length} projects may delay next month`,
				description: `Based on current trends, ${delayedProjects.length} projects are showing delay patterns. Early intervention could prevent timeline slippage.`,
				severity: 'warning',
				category: 'timeline',
				actionLabel: 'See Forecast',
				actionData: { view: 'delays' },
				confidence: 76
			});
		}

		// Insight 4: Performance recommendation
		const lowEfficiencyProjects = projects.filter(p => p.efficiency < 50);
		if (lowEfficiencyProjects.length > 0) {
			insights.push({
				id: 'insight-4',
				title: 'Efficiency optimization opportunity',
				description: `${lowEfficiencyProjects.length} projects have efficiency scores below 50%. Consider resource reallocation or process improvements.`,
				severity: 'info',
				category: 'performance',
				actionLabel: 'View Details',
				actionData: { filter: 'low-efficiency' },
				confidence: 82
			});
		}

		return insights;
	});

	// Critical projects (top 5 by risk)
	criticalProjects = computed(() => {
		return this.filteredProjects()
			.filter(p => p.risk > 70)
			.sort((a, b) => b.risk - a.risk)
			.slice(0, 5);
	});

	// Top performers (top 5 by efficiency)
	topPerformers = computed(() => {
		return this.filteredProjects()
			.sort((a, b) => b.efficiency - a.efficiency)
			.slice(0, 5);
	});

	ngOnInit(): void {
		// Load available options
		this.availableDepartments = this.demoDataService.getDepartments();
		this.availableRegions = this.demoDataService.getRegions();
		this.availableStatuses = this.demoDataService.getStatuses();

		// Simulate loading delay
		setTimeout(() => {
			this.allProjects.set(this.demoDataService.generateProjects(48));
			this.isLoading.set(false);
			this.toastService.success('Dashboard loaded successfully');
		}, 900);
	}

	onFiltersChange(newFilters: Filters): void {
		this.filters.set(newFilters);
	}

	openProjectDrawer(project: Project): void {
		this.selectedProject.set(project);
		this.isDrawerOpen.set(true);
	}

	closeProjectDrawer(): void {
		this.isDrawerOpen.set(false);
		setTimeout(() => this.selectedProject.set(null), 300);
	}

	filterByDepartment(dept: Department): void {
		this.filters.update(f => ({ ...f, departments: [dept] }));
		this.activeTab.set('projects');
		this.closeProjectDrawer();
	}

	filterByRegion(region: Region): void {
		this.filters.update(f => ({ ...f, regions: [region] }));
		this.activeTab.set('projects');
		this.closeProjectDrawer();
	}

	filterByStatus(status: ProjectStatus): void {
		this.filters.update(f => ({ ...f, statuses: [status] }));
		this.activeTab.set('projects');
		this.closeProjectDrawer();
	}

	getDepartmentStats(dept: Department) {
		const deptProjects = this.allProjects().filter(p => p.department === dept);
		const total = deptProjects.length;
		const avgRisk = total > 0 ? Math.round(deptProjects.reduce((sum, p) => sum + p.risk, 0) / total) : 0;
		const avgEfficiency = total > 0 ? Math.round(deptProjects.reduce((sum, p) => sum + p.efficiency, 0) / total) : 0;
		return { total, avgRisk, avgEfficiency };
	}

	exportCSV(): void {
		this.exportService.exportToCSV(this.filteredProjects());
		this.toastService.success('Projects exported to CSV');
	}

	exportJSON(): void {
		this.exportService.exportToJSON({
			projects: this.filteredProjects(),
			filters: this.filters()
		});
		this.toastService.success('Dashboard exported to JSON');
	}

	print(): void {
		this.exportService.printDashboard();
	}

	toggleDarkMode(): void {
		this.themeService.toggle();
	}

	onActivityClick(activity: Activity): void {
		// Find the project related to this activity and open its drawer
		const project = this.allProjects().find(p => p.id === activity.projectId);
		if (project) {
			this.openProjectDrawer(project);
		}
	}

	viewAllActivities(): void {
		// Switch to Projects tab to see all projects
		this.activeTab.set('projects');
		this.toastService.info('Viewing all projects');
	}

	onInsightAction(insight: Insight): void {
		// Handle insight actions
		switch (insight.actionData?.filter) {
			case 'high-risk':
				this.filters.update(f => ({ ...f, maxRisk: 70 }));
				this.activeTab.set('projects');
				this.toastService.info('Filtered to show high-risk projects');
				break;
			case 'low-efficiency':
				// Custom filter for low efficiency (would need to add this to filters)
				this.activeTab.set('projects');
				this.toastService.info('Showing low-efficiency projects');
				break;
			default:
				if (insight.actionData?.view === 'budget') {
					this.activeTab.set('analytics');
					this.toastService.info('Viewing budget analysis');
				} else if (insight.actionData?.view === 'delays') {
					this.activeTab.set('analytics');
					this.toastService.info('Viewing delay analysis');
				}
		}
	}

	/**
	 * Generate realistic sparkline data showing historical trend
	 * @param currentValue - The current/end value
	 * @param changePercent - Percentage change over the period
	 * @param days - Number of days to generate
	 */
	private generateSparklineData(currentValue: number, changePercent: number, days: number = 30): number[] {
		const data: number[] = [];

		// Calculate starting value based on change percent
		const startValue = currentValue / (1 + changePercent / 100);

		// Generate smooth trend with some variance
		for (let i = 0; i < days; i++) {
			// Linear progression from start to current value
			const progress = i / (days - 1);
			const baseValue = startValue + (currentValue - startValue) * progress;

			// Add realistic variance (±5% random fluctuation)
			const variance = (Math.sin(i * 0.5) + Math.cos(i * 0.3)) * 0.025 * baseValue;

			data.push(Math.max(0, baseValue + variance));
		}

		return data;
	}
}
