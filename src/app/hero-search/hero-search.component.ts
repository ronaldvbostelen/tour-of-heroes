import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { HeroService } from '../services/hero.service';
import { Hero } from '../models/hero';


@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private heroes: Hero[];
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService,
              private router: Router) { }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.heroService.searchHero(term)),
    );

    this.heroes$.subscribe((x: Hero[]) => this.heroes = x,
                                 error => console.log(error)
    );
  }

  search(term: string): void{
    this.searchTerms.next(term);
  }

  onEnter(term: string): void{
    if (!term || !this.heroes || this.heroes.length !== 1){return; }

    this.router.navigateByUrl(`/detail/${this.heroes[0].id}`);

  }

}
