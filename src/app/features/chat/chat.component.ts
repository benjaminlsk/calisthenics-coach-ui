import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MessageResponse, UserResponse } from '../../core/models/models';
import { ApiService } from '../../core/services/api.service';
import { UserStateService } from '../../core/services/user-state.service';
import { CoachFormatPipe } from '../../core/pipes/coach-format.pipe';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, CoachFormatPipe, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  userId!: number;
  user: UserResponse | null = null;
  messages: ChatMessage[] = [];
  inputMessage = '';
  isLoading = false;
  shouldScroll = false;

  // Raccourcis rapides affichés au démarrage
  quickActions = [
    { label: '📋 Crée mon programme', message: 'Crée-moi un programme d\'entraînement complet adapté à mon profil.' },
    { label: '💪 Exercice du jour',    message: 'Donne-moi l\'exercice clé sur lequel me concentrer cette semaine.' },
    { label: '🤸 Explique le muscle-up', message: 'Explique-moi la progression complète pour apprendre le muscle-up.' },
    { label: '📈 Évalue ma progression', message: 'Comment savoir si je progresse bien et quand passer au niveau supérieur ?' },
  ];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public userState: UserStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('userId'));
    this.loadUser();
    this.loadHistory();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private loadUser(): void {
    this.api.getUser(this.userId).subscribe({
      next: (user: UserResponse) => {
        this.user = user;
        this.userState.saveUser(user);
        this.cdr.markForCheck();
      }
    });
  }

  private loadHistory(): void {
    this.api.getChatHistory(this.userId).subscribe({
      next: (history: MessageResponse[]) => {
        this.messages = history.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at)
        }));
        this.shouldScroll = true;
        this.cdr.markForCheck();
      }
    });
  }

  sendMessage(text?: string): void {
    const content = (text ?? this.inputMessage).trim();
    if (!content || this.isLoading) return;

    // Ajout immédiat du message utilisateur (UX optimiste)
    this.messages.push({ role: 'user', content, timestamp: new Date() });
    this.inputMessage = '';
    this.isLoading = true;
    this.shouldScroll = true;

    this.api.sendMessage(this.userId, content).subscribe({
      next: (response) => {
        this.messages.push({
          role: 'assistant',
          content: response.message,
          timestamp: new Date(response.timestamp)
        });
        this.isLoading = false;
        this.shouldScroll = true;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur envoi message', err);
        this.messages.push({
          role: 'assistant',
          content: '⚠️ Une erreur est survenue. Réessaie dans quelques instants.',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.shouldScroll = true;
        this.cdr.markForCheck();
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
  }

  get hasMessages(): boolean {
    return this.messages.length > 0;
  }

  getLevelLabel(level: string): string {
    const labels: Record<string, string> = {
      BEGINNER: '🌱 Débutant',
      INTERMEDIATE: '🔥 Intermédiaire',
      ADVANCED: '⚡ Avancé'
    };
    return labels[level] ?? level;
  }
}
