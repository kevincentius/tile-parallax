import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ParallaxData, ParallaxLayer } from './parallax';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parallax-background',
  standalone: true,
  imports: [ CommonModule, ],
  templateUrl: './parallax-background.component.html',
  styleUrls: ['./parallax-background.component.scss']
})
export class ParallaxBackgroundComponent {

  @Input() assetBasePath = 'assets/img/bg/parallax/';

  layers: ParallaxLayer[] = [];

  @ViewChild('parallaxContainer', { static: true }) container!: ElementRef<HTMLDivElement>;
  width = 100;

  setParallax(parallaxData: ParallaxData) {
    this.layers = parallaxData.layers.map(l => ({
      data: l,
      offset: 0,
    }))
  }

  advance(pixels: number) {
    this.layers.forEach(l => l.offset += l.data.mult * pixels);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.width = this.container.nativeElement.clientWidth;
  }
  
  constructor() { }
}
