import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Project, Department, Region, ProjectStatus } from '../../types/models';
import { ExportService } from '../../services/export.service';
import { ToastService } from '../../services/toast.service';

@Component({
	selector: 'app-project-drawer',
	standalone: true,
	imports: [CommonModule],
	animations: [
		trigger('slideIn', [
			transition(':enter', [
				style({ transform: 'translateX(100%)' }),
				animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0)' }))
			]),
			transition(':leave', [
				animate('200ms cubic-bezier(0.4, 0, 1, 1)', style({ transform: 'translateX(100%)' }))
			])
		]),
		trigger('fadeIn', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('200ms ease-in', style({ opacity: 1 }))
			]),
			transition(':leave', [
				animate('150ms ease-out', style({ opacity: 0 }))
			])
		])
	],
	template: `
    @if (isOpen && project) {
      <!-- Backdrop -->
      <div
        @fadeIn
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] no-print"
        (click)="close()"
        [attr.aria-hidden]="true"
      ></div>

      <!-- Drawer -->
      <div
        @slideIn
        class="fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] bg-white dark:bg-gray-900 shadow-2xl z-[110] overflow-y-auto no-print"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="'drawer-title-' + project.id"
      >
        <!-- Header -->
        <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <div class="flex-1 min-w-0">
            <h2 [id]="'drawer-title-' + project.id" class="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
              {{ project.name }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ project.id }}</p>
          </div>
          <button
            (click)="close()"
            class="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close drawer"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="px-6 py-6 space-y-6">
          <!-- Status Badge & Quick Info -->
          <div class="flex flex-wrap gap-3">
            <span [class]="getStatusBadgeClass()" class="px-3 py-1.5 text-sm font-semibold rounded-full">
              {{ project.status }}
            </span>
            <span class="px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
              {{ project.phase }}
            </span>
          </div>

          <!-- Project Details Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Department</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ project.department }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Region</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ project.region }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Owner</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ project.owner }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Duration</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ getDuration() }} days</p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</p>
              <p class="text-sm font-bold text-primary-600 dark:text-primary-400">{{ project.progress }}%</p>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                class="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                [style.width.%]="project.progress"
              ></div>
            </div>
          </div>

          <!-- Metrics Cards -->
          <div class="grid grid-cols-3 gap-3">
            <!-- Risk -->
            <div class="bg-gradient-to-br from-danger-50 to-danger-100 dark:from-danger-900/20 dark:to-danger-800/20 p-4 rounded-xl border border-danger-200 dark:border-danger-800">
              <p class="text-xs font-medium text-danger-700 dark:text-danger-300 uppercase tracking-wide mb-2">Risk</p>
              <p class="text-2xl font-bold text-danger-600 dark:text-danger-400">{{ project.risk }}</p>
              <div class="mt-2 w-full bg-danger-200 dark:bg-danger-800 rounded-full h-1.5">
                <div class="bg-danger-600 h-1.5 rounded-full" [style.width.%]="project.risk"></div>
              </div>
            </div>

            <!-- Reward -->
            <div class="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 p-4 rounded-xl border border-success-200 dark:border-success-800">
              <p class="text-xs font-medium text-success-700 dark:text-success-300 uppercase tracking-wide mb-2">Reward</p>
              <p class="text-2xl font-bold text-success-600 dark:text-success-400">{{ project.reward }}</p>
              <div class="mt-2 w-full bg-success-200 dark:bg-success-800 rounded-full h-1.5">
                <div class="bg-success-600 h-1.5 rounded-full" [style.width.%]="project.reward"></div>
              </div>
            </div>

            <!-- Efficiency -->
            <div class="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-4 rounded-xl border border-primary-200 dark:border-primary-800">
              <p class="text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wide mb-2">Efficiency</p>
              <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ project.efficiency }}</p>
              <div class="mt-2 w-full bg-primary-200 dark:bg-primary-800 rounded-full h-1.5">
                <div class="bg-primary-600 h-1.5 rounded-full" [style.width.%]="project.efficiency"></div>
              </div>
            </div>
          </div>

          <!-- Budget Information -->
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Budget Breakdown
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Allocated</span>
                <span class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(project.budgetAllocated) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Spent</span>
                <span class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(project.budgetSpent) }}</span>
              </div>
              <div class="flex items-center justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Burn Rate</span>
                <span [class]="getBurnRateClass()" class="text-sm font-bold">
                  {{ getBurnRate() }}%
                </span>
              </div>
              <div class="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
                <div
                  [class]="getBurnRateBarClass()"
                  class="h-2.5 rounded-full transition-all duration-500"
                  [style.width.%]="Math.min(getBurnRate(), 100)"
                ></div>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-5 rounded-xl border border-purple-200 dark:border-purple-800">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Timeline
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Start Date</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ formatDate(project.startDate) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">End Date</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ formatDate(project.endDate) }}</span>
              </div>
              @if (project.delayDays > 0) {
                <div class="flex items-center justify-between pt-2 border-t border-purple-300 dark:border-purple-600">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Delay</span>
                  <span class="text-sm font-bold text-danger-600 dark:text-danger-400">+{{ project.delayDays }} days</span>
                </div>
              }
            </div>
          </div>

          <!-- AI Explanation -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              AI Severity Analysis
            </h3>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ getAIExplanation() }}
            </p>
          </div>

          <!-- Quick Actions -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Actions</h3>
            <div class="grid grid-cols-2 gap-3">
              <button
                (click)="exportProject()"
                class="px-4 py-2.5 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Export
              </button>
              <button
                (click)="filterByDepartment()"
                class="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
                Filter Dept
              </button>
              <button
                (click)="filterByRegion()"
                class="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Filter Region
              </button>
              <button
                (click)="filterByStatus()"
                class="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Filter Status
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
	styles: []
})
export class ProjectDrawerComponent implements OnChanges {
	@Input() project: Project | null = null;
	@Input() isOpen: boolean = false;
	@Output() closeDrawer = new EventEmitter<void>();
	@Output() filterByDept = new EventEmitter<Department>();
	@Output() filterByReg = new EventEmitter<Region>();
	@Output() filterByStat = new EventEmitter<ProjectStatus>();

	Math = Math;
	private exportService = inject(ExportService);
	private toastService = inject(ToastService);

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['isOpen'] && this.isOpen && this.project) {
			// Prevent body scroll when drawer is open
			document.body.style.overflow = 'hidden';
		} else if (changes['isOpen'] && !this.isOpen) {
			document.body.style.overflow = '';
		}
	}

	ngOnDestroy(): void {
		document.body.style.overflow = '';
	}

	close(): void {
		this.closeDrawer.emit();
	}

	getStatusBadgeClass(): string {
		if (!this.project) return '';
		switch (this.project.status) {
			case 'On Track':
				return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300';
			case 'In Progress':
				return 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300';
			case 'Delayed':
				return 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300';
			case 'Blocked':
				return 'bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-300';
			default:
				return '';
		}
	}

	getDuration(): number {
		if (!this.project) return 0;
		const diff = this.project.endDate.getTime() - this.project.startDate.getTime();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	}

	formatCurrency(value: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(value);
	}

	formatDate(date: Date): string {
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	getBurnRate(): number {
		if (!this.project || this.project.budgetAllocated === 0) return 0;
		return Math.round((this.project.budgetSpent / this.project.budgetAllocated) * 100);
	}

	getBurnRateClass(): string {
		const rate = this.getBurnRate();
		if (rate > 100) return 'text-danger-600 dark:text-danger-400';
		if (rate > 90) return 'text-warning-600 dark:text-warning-400';
		return 'text-success-600 dark:text-success-400';
	}

	getBurnRateBarClass(): string {
		const rate = this.getBurnRate();
		if (rate > 100) return 'bg-gradient-to-r from-danger-500 to-danger-600';
		if (rate > 90) return 'bg-gradient-to-r from-warning-500 to-warning-600';
		return 'bg-gradient-to-r from-success-500 to-success-600';
	}

	getAIExplanation(): string {
		if (!this.project) return '';

		const riskWeight = this.project.risk * 0.4;
		const delayWeight = this.project.delayDays * 2;
		const burnWeight = this.getBurnRate() > 100 ? (this.getBurnRate() - 100) * 0.5 : 0;
		const severityScore = riskWeight + delayWeight + burnWeight;

		let explanation = `This project has a severity score of ${Math.round(severityScore)} calculated from: `;
		explanation += `Risk (${this.project.risk}) contributing ${riskWeight.toFixed(1)} points, `;
		explanation += `Delays (${this.project.delayDays} days) adding ${delayWeight.toFixed(1)} points, `;
		explanation += `and Budget burn rate (${this.getBurnRate()}%) adding ${burnWeight.toFixed(1)} points. `;

		if (severityScore > 80) {
			explanation += 'This indicates critical attention required with immediate intervention needed.';
		} else if (severityScore > 50) {
			explanation += 'This suggests elevated concern and close monitoring is recommended.';
		} else if (severityScore > 25) {
			explanation += 'This shows moderate risk with standard oversight sufficient.';
		} else {
			explanation += 'This indicates low risk with the project proceeding well.';
		}

		return explanation;
	}

	exportProject(): void {
		if (this.project) {
			this.exportService.exportSingleProject(this.project);
			this.toastService.success('Project exported successfully');
		}
	}

	filterByDepartment(): void {
		if (this.project) {
			this.filterByDept.emit(this.project.department);
			this.toastService.info(`Filtered by ${this.project.department}`);
		}
	}

	filterByRegion(): void {
		if (this.project) {
			this.filterByReg.emit(this.project.region);
			this.toastService.info(`Filtered by ${this.project.region}`);
		}
	}

	filterByStatus(): void {
		if (this.project) {
			this.filterByStat.emit(this.project.status);
			this.toastService.info(`Filtered by ${this.project.status}`);
		}
	}
}
