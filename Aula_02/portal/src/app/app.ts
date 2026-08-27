import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { CardProduct } from './card-product/card-product';
import { HeroBanner } from './hero-banner/hero-banner';
import { Sidebar } from './sidebar/sidebar';

@Component({
  imports: [RouterOutlet, Footer, Header, CardProduct, HeroBanner, Sidebar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('portal');
}
