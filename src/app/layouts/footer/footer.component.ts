import { Component } from '@angular/core';
@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer"><div class="container"><div class="row">
      <div class="col-md-4"><h5>🛍️ Monecome</h5><p>Votre marketplace de confiance</p></div>
      <div class="col-md-4"><h5>Liens</h5><ul class="list-unstyled"><li><a routerLink="/">Accueil</a></li><li><a routerLink="/produits">Produits</a></li></ul></div>
      <div class="col-md-4"><h5>Contact</h5><p>contact&#64;monecome.com</p></div>
    </div><hr><div class="text-center"><p>&copy; 2024 Monecome</p></div></div></footer>
  `,
  styles: [`.footer { background: #1e293b; color: #94a3b8; padding: 40px 0 20px; margin-top: 60px; } .footer h5 { color: white; } .footer a { color: #94a3b8; text-decoration: none; } .footer a:hover { color: #14b8a6; }`]
})
export class FooterComponent {}
