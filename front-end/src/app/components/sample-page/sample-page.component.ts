// angular import
import { Component, OnInit } from '@angular/core';
import { EepService } from '../../service/eep.service';
import { EEP } from '../../models/eep.model';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sample-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})
export default class SamplePageComponent implements OnInit {
  eeps: EEP[] = [];
  newEEP: EEP = { idEep: '', raison: '', sigle: '' };

  constructor(private eepService: EepService) { }

  ngOnInit(): void {
    this.eepService.getAllEEPs().subscribe(data => {
      console.log('Données des EEPs reçues :', data); // Vérifiez les données reçues depuis le service
      this.eeps = data;
    });
  }

  onSubmit(): void {
    this.eepService.createEEP(this.newEEP).subscribe(createdEEP => {
      this.eeps.push(createdEEP);
      this.newEEP = { idEep: '', raison: '', sigle: '' }; // Réinitialiser le formulaire
    });
  }

  onDelete(idEep: string): void {
    this.eepService.deleteEEP(idEep).subscribe(() => {
      this.eeps = this.eeps.filter(eep => eep.idEep !== idEep);
    });
  }
}
