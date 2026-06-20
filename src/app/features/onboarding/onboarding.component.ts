import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  CreateUserRequest, Level, Equipment,
  AVAILABLE_GOALS, Goal
} from '../../core/models/models';
import { ApiService } from '../../core/services/api.service';
import { UserStateService } from '../../core/services/user-state.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class OnboardingComponent {

  currentStep = 1;
  totalSteps = 5;
  isSubmitting = false;

  // Formulaire local
  form: Partial<CreateUserRequest> & { name: string; injuries: string } = {
    name: '',
    level: undefined,
    goals: [],
    weekly_frequency: 3,
    equipment: undefined,
    injuries: ''
  };

  // ─── Données statiques ────────────────────────────────────────────────────

  levels = [
    { key: 'BEGINNER' as Level,     emoji: '🌱', label: 'Débutant',      desc: 'Je débute ou moins de 6 mois de pratique' },
    { key: 'INTERMEDIATE' as Level, emoji: '🔥', label: 'Intermédiaire', desc: 'Je maîtrise les bases (pull-ups, dips)' },
    { key: 'ADVANCED' as Level,     emoji: '⚡', label: 'Avancé',        desc: 'Je cherche les skills (MU, FL, planche)' },
  ];

  equipmentOptions = [
    { key: 'BODYWEIGHT_ONLY' as Equipment, emoji: '🏠', label: 'Sol uniquement'       },
    { key: 'BAR_ONLY' as Equipment,        emoji: '🏗️', label: 'Barre de traction'     },
    { key: 'BAR_AND_RINGS' as Equipment,   emoji: '🤸', label: 'Barre + anneaux'       },
    { key: 'FULL' as Equipment,            emoji: '💪', label: 'Matériel complet'      },
  ];

  availableGoals: Goal[] = AVAILABLE_GOALS;

  constructor(
    private api: ApiService,
    private userState: UserStateService,
    private router: Router
  ) {}

  // ─── Navigation ───────────────────────────────────────────────────────────

  nextStep(): void {
    if (this.canProceed() && this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1: return !!this.form.name?.trim() && !!this.form.level;
      case 2: return (this.form.goals?.length ?? 0) > 0;
      case 3: return !!this.form.weekly_frequency;
      case 4: return !!this.form.equipment;
      case 5: return true; // champ optionnel
      default: return false;
    }
  }

  // ─── Goals ────────────────────────────────────────────────────────────────

  toggleGoal(key: string): void {
    const goals = this.form.goals ?? [];
    const idx = goals.indexOf(key);
    if (idx >= 0) {
      goals.splice(idx, 1);
    } else {
      goals.push(key);
    }
    this.form.goals = [...goals];
  }

  isGoalSelected(key: string): boolean {
    return this.form.goals?.includes(key) ?? false;
  }

  // ─── Fréquence hint ───────────────────────────────────────────────────────

  getFrequencyHint(): string {
    const hints: Record<number, string> = {
      2: 'Parfait pour récupérer et progresser doucement.',
      3: 'Le meilleur équilibre pour la majorité des athlètes.',
      4: 'Programme de progression rapide.',
      5: 'Pour les athlètes sérieux. La récupération sera clé.',
      6: 'Niveau avancé — splits poussée/traction indispensables.',
    };
    return hints[this.form.weekly_frequency ?? 3] ?? '';
  }

  // ─── Soumission ───────────────────────────────────────────────────────────

  submit(): void {
    if (!this.canSubmit()) return;

    this.isSubmitting = true;

    const request: CreateUserRequest = {
      name:             this.form.name.trim(),
      level:            this.form.level!,
      goals:            this.form.goals!,
      weekly_frequency: this.form.weekly_frequency!,
      equipment:        this.form.equipment!,
      injuries:         this.form.injuries || undefined,
    };

    this.api.createUser(request).subscribe({
      next: (user) => {
        this.userState.saveUser(user);
        this.router.navigate(['/chat', user.id]);
      },
      error: (err) => {
        console.error('Erreur lors de la création du profil', err);
        this.isSubmitting = false;
      }
    });
  }

  private canSubmit(): boolean {
    return !!(
      this.form.name?.trim() &&
      this.form.level &&
      this.form.goals?.length &&
      this.form.weekly_frequency &&
      this.form.equipment
    );
  }
}
