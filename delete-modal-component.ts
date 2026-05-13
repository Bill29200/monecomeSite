// Composant modale réutilisable
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-vendeur-delete-modal',
  template: `
    <div class="delete-modal-overlay" (click)="onCancel.emit()">
      <div class="delete-modal-container" (click)="$event.stopPropagation()">
        <div class="delete-modal-header">
          <div class="delete-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12M12 16H12.01M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <button class="delete-modal-close" (click)="onCancel.emit()">&times;</button>
        </div>
        
        <div class="delete-modal-body">
          <h3 class="delete-title">Supprimer le vendeur</h3>
          <p class="delete-message">
            Vous êtes sur le point de supprimer définitivement le vendeur :
          </p>
          <div class="vendeur-name">
            <strong>{{ vendeur?.nom || vendeur?.displayName }}</strong>
          </div>
          
          <div class="warning-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 9V13M12 17H12.01M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z" stroke="#dc2626" stroke-width="2"/>
            </svg>
            <div class="warning-text">
              <span class="warning-title">Action irréversible</span>
              <span class="warning-desc">Toutes ses boutiques et tous leurs produits seront également supprimés.</span>
            </div>
          </div>
        </div>
        
        <div class="delete-modal-footer">
          <button class="btn-cancel" (click)="onCancel.emit()" [disabled]="isDeleting">
            Annuler
          </button>
          <button class="btn-danger" (click)="onConfirm.emit()" [disabled]="isDeleting">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V16M14 11V16M15 4H9M18 7H6"/>
            </svg>
            {{ isDeleting ? 'Suppression...' : 'Oui, tout supprimer' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .delete-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease-out;
    }
    .delete-modal-container {
      background: white;
      border-radius: 24px;
      width: 90%;
      max-width: 480px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.3s ease-out;
    }
    .delete-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px 0 24px;
    }
    .delete-icon {
      width: 48px;
      height: 48px;
      background: #fee2e2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #dc2626;
    }
    .delete-modal-close {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #9ca3af;
    }
    .delete-modal-body {
      padding: 20px 24px;
    }
    .delete-title {
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 8px 0;
    }
    .delete-message {
      color: #6b7280;
      font-size: 14px;
      margin: 0 0 12px 0;
    }
    .vendeur-name {
      background: #f9fafb;
      padding: 12px 16px;
      border-radius: 12px;
      margin: 16px 0;
      text-align: center;
    }
    .vendeur-name strong {
      font-size: 18px;
      color: #111827;
    }
    .warning-box {
      background: #fef2f2;
      border-left: 4px solid #dc2626;
      padding: 16px;
      border-radius: 12px;
      display: flex;
      gap: 12px;
    }
    .warning-title {
      font-weight: 600;
      color: #dc2626;
      font-size: 14px;
    }
    .warning-desc {
      font-size: 13px;
      color: #7f1d1d;
    }
    .delete-modal-footer {
      padding: 16px 24px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      border-top: 1px solid #e5e7eb;
    }
    .btn-cancel {
      padding: 10px 20px;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 12px;
      font-weight: 500;
      cursor: pointer;
    }
    .btn-danger {
      padding: 10px 24px;
      background: #dc2626;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-danger:hover:not(:disabled) {
      background: #b91c1c;
    }
    .btn-danger:disabled, .btn-cancel:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class VendeurDeleteModalComponent {
  @Input() vendeur: any;
  @Input() isDeleting: boolean = false;
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
}
