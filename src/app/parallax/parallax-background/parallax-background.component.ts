import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ParallaxData, ParallaxLayerData } from '../parallax-data/parallax-data';
import { CommonModule } from '@angular/common';
import { ImgSrcProvider } from '../parallax-data/img-src-provider';

export interface ParallaxLayer {
  data: ParallaxLayerData;
  offset: number;
}

@Component({
  selector: 'app-parallax-background',
  standalone: true,
  imports: [ CommonModule, ],
  templateUrl: './parallax-background.component.html',
  styleUrls: ['./parallax-background.component.scss']
})
export class ParallaxBackgroundComponent {

  @Input() imgSrcProvider!: ImgSrcProvider;

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
