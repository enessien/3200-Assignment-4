///\/\/\\\/\\/\/\\//\/\/////\\/\//\/\/\\\/\\/\/\\//\/\/////\\/\/
//
//  Assignment       COMP3200 - Assignment 4
//  Professor:       David Churchill
//  Year / Term:     2022-09
//  File Name:       Sudoku.js
// 
//  Student Name:    Ekuyik Essien
//  Student User:    enessien
//  Student Email:   enessien@mun.ca
//  Student ID:      202023347
//  Group Member(s): Matthew Keough mkeough18@mun.ca #201800737
//
///\/\/\\\/\\/\/\\//\/\/////\\/\//\/\/\\\/\\/\/\\//\/\/////\\/\/
                   
class Sudoku {
                   
    constructor(size) {
        this.size = size;
        this.sqSize = Math.sqrt(size);
        this.board = [];
        for (var i=0; i<size*size; i++) { this.board[i] = 0; }
    }
    
    getIndex(row, col) {
        return this.size * row + col;        
    }

    randomize() {
        for (var i=0; i<this.size*this.size; i++) { 
            this.board[i] = Math.floor(Math.random() * this.size) + 1; 
        }
    }

    set(row, col, val) {
        this.board[this.getIndex(row, col)] = val;       
    }
                   
    get(row, col) {
        return this.board[this.getIndex(row, col)];
    }

    numConflicts(row, col) {
        let sum = 0;
        // get the row conflicts
        for (let c=0; c<this.size; c++) {
            if (c != col && (this.get(row,c) == this.get(row,col))) {
                sum++;
                break;
            }
        }
        // get the column conflicts
        for (let r=0; r<this.size; r++) {
            if (r != row && (this.get(r,col) == this.get(row,col))) {
                sum++;
                break;
            }
        }

        let sr = Math.floor(row / this.sqSize) * this.sqSize;
        let sc = Math.floor(col / this.sqSize) * this.sqSize;
        for (let dr=0; dr<this.sqSize; dr++) {
            for (let dc=0; dc<this.sqSize; dc++) {
                let r = sr + dr;
                let c = sc + dc;
                if (r != row && c != col && (this.get(r,c) == this.get(row,col))) {
                    sum++;
                    break;
                }
            }
        }
                   
        return sum;
    }

    setArray(array) {
        this.board = array;
        this.size = Math.round(Math.sqrt(array.length));
        this.sqSize = Math.sqrt(this.size);
    }
}

// Copyright (C) David Churchill - All Rights Reserved
// COMP3200 - 2022-09 - Assignment 4
// Written by David Churchill (dave.churchill@gmail.com)
// Unauthorized copying of these files are strictly prohibited
// Distributed only for course work at Memorial University
// If you see this file online please contact email above
