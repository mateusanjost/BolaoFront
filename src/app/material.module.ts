import { NgModule } from '@angular/core';
import {
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSliderModule,
    MatProgressSpinnerModule 
    } from '@angular/material';

const MATERIAL_MODULES = [
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatProgressSpinnerModule 
];

@NgModule({
    imports: [
        MATERIAL_MODULES
    ],
    exports: [
        MATERIAL_MODULES
    ]
})

export class MaterialModule {}