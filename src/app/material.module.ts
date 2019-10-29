import { NgModule } from '@angular/core';
import {
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
    } from '@angular/material';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';

const MATERIAL_MODULES = [
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
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