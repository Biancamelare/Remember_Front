import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})

export class SidenavComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const menuItem = document.querySelectorAll('.box-selecao');
    const btnExp = document.querySelector('#btn-exp') as HTMLElement;
    const menuSide = document.querySelector('.menu-lateral') as HTMLElement;

    menuItem.forEach((item: Element) => {
      item.addEventListener('click', () => {
        this.selectLink(item);
      });
    });

    btnExp.addEventListener('click', () => {
      menuSide.classList.toggle('expandir');
    });
  }

  selectLink(item: Element) {
    const menuItem = document.querySelectorAll('.box-selecao');
    menuItem.forEach((element: Element) => {
      element.classList.remove('ativo');
    });
    item.classList.add('ativo');
  }
}
