///\/\/\\\\//\\/\/\/\\/\\///\\////\/\/\\\\//\\/\/\/\\/\\///\\///
//
//  Assignment       COMP3200 - Assignment 4
//  Professor:       David Churchill
//  Year / Term:     2022-09
//  File Name:       GA_Student.js
// 
//  Student Name:    Matthew Keough
//  Student User:    mkeough18
//  Student Email:   mkeough18@mun.ca
//  Student ID:      201800737
//  Group Member(s): Ekuyik Essien enessien@mun.ca #202023347
//
///\/\/\\\\//\\/\/\/\\/\\///\\////\/\/\\\\//\\/\/\/\\/\\///\\///

// Student TODO: Write this function
//
// Note: population is an array of JavaScript objects containing two variables
//       { gene: [array of integer values], fitness: number }
//       - population[i].gene    = 1D array representation of the individual (genotype)
//       - population[i].fitness = fitness of the invidivual (calculated when added to population)
//
function GAEvolve(population, settings) 
{
    // 1. Set up a new array which will hold the next population
    let nextPopulation = [];

    // 2. Sort the population descending based on fitness 
    population.sort((a, b) => b.fitness - a.fitness);
    
    // 3. Add the top N elite (top fitness) individuals to the next population
    //    The percentage of elite genes to carry over is given in settings.elitismRatio
    //    Sorting the population array by fitness is an easy way to do this
    let top = settings.elitismRatio * population.length;
    let e = 0;
    while (e < top)
    {
        nextPopulation.push(population[e]);
        e++;
    }

    // 4. Add the required number of random individuals to the next population
    //    The percentage of random genes to carry over is given in settings.randomRatio
    //    You can get a random gene value by calling settings.getRandomGeneValue()
    //    Make sure you add the following Object to the array whenever adding an individual
    //    nextPopulation.push({ gene: geneVariable, fitness: settings.fitnessFunction(geneVariable) });
    let rand = settings.randomRatio * population.length;
    let r = 0;
    while (r < rand)
    {
        let geneVariable = settings.getRandomGeneValue();
        nextPopulation.push({ gene: geneVariable, fitness: settings.fitnessFunction(geneVariable) });
        r++;
    }

    // 5. Perform the child generation process, which is as follows:
    //
    //    // we keep adding children until we fill the next population
    //    // first, compute the sum of all the fitnesses in the population
    //    let fitnessSum = calculate sum of previous population fitnesses
    //
    //    while (nextPopulation is smaller than settings.populationSize)
    //       let parent1 = RouletteWheelSelection(population, fitnessSum);
    //       let parent2 = RouletteWheelSelection(population, fitnessSum);
    //       let child1  = CrossOver(parent1, parent2, settings);
    //       let child2  = CrossOver(parent2, parent1, settings);
    //       MutateIndividual(child1, settings);
    //       MutateIndividual(child2, settings);
    //
    //       Add the children to the population
    //       Be careful not to add child2 if it would go above the population size
    let fitnessSum = 0;
    for (let i=0; i<population.length; i++)
    {
        fitnessSum += population[i];
    }

    while (nextPopulation.length < settings.populationSize)
    {
        let parent1 = RouletteWheelSelection(population, fitnessSum);
        let parent2 = RouletteWheelSelection(population, fitnessSum);
        let child1  = CrossOver(parent1, parent2, settings);
        let child2  = CrossOver(parent2, parent1, settings);
        MutateIndividual(child1, settings);
        MutateIndividual(child2, settings);
        nextPopulation.push(child1);
        if(nextPopulation.length != settings.populationSize-1)
        {
            nextPopulation.push(child2);
        }
    }

    // the nextPopulation array should always be the same length as settings.populationSize
    // IMPORTANT: Change this to return nextPopulation
    return nextPopulation;
}

// Student TODO: Write this function
//
// Select a parent individual from a population based on roulette wheel selection
function RouletteWheelSelection(population, fitnessSum) 
{
    let selectedIndex = 0; // use the algorithm from the slides
    return population[selectedIndex];
}

// Student TODO: Write this function
//
// Perform crossover on two parent individuals and return the child individual
function CrossOver(parent1, parent2, settings) 
{
    let childGene = [];
    // add the first half of parent1 gene to childGene
    let half1 = Math.floor(parent1.length-1 / 2); // one left of midpoint if not exact half
    for (let i=0; i<half1; i++)
    {
        childGene.push(parent1[i]);
    }
    // add the second half of parent2 gene to childGene
    let half2 = Math.ceil(parent2.length-1 / 2); // one right of midpoint if not exact half
    for (let i=0; i<half2; i++)
    {
        childGene.push(parent2[i]);
    }
    // NOTE: the size of the child gene must equal the size of the parent gene
    //       be very careful of this when parent size is odd and there's not exact half
    //       choose 1 left or 1 right of the midpoint, it doesn't matter

    return { gene: childGene, fitness: settings.fitnessFunction(childGene) };
}

// Student TODO: Write this function
//
// Mutate an individual based on the settings mutation rate
function MutateIndividual(individual, settings)
{
    // mutation changes a random index of the gene to settings.getRandomGeneValue()
    // mutation chance = if (random number between [0,1] is < settings.mutationRate)
    // this function modifies the individual and returns nothing
}
                                                   
// Student TODO: Re-write this function to be more 'clever'
//
// See if you can modify this function so that the GA gets
// closer to solving the Sudoku than the version listed here
//
// Note: Due to the way roulette wheel selection works, this
//       function must return a higher fitness for a better
//       solution. You cannot return negative fitnesses.
function SudokuFitness(array) 
{
    let s = new Sudoku(9);
    let size = Math.round(Math.sqrt(array.length));
    s.setArray(array);
    let fitness = 0;
    // add unique values in each row
    for (let r = 0; r < size; r++) 
    {
        let vals = new Set();
        for (let c = 0; c < size; c++) 
        {
            vals.add(s.get(r, c));
        }
        fitness += vals.size;
    }
    // add unique values in each column
    for (let c = 0; c < size; c++) 
    {
        let vals = new Set();
        for (let r = 0; r < size; r++) 
        {
            vals.add(s.get(r, c));
        }
        fitness += vals.size;
    }
    // add unique values in each square
    let sqsize = Math.round(Math.sqrt(size));
    for (let sr = 0; sr < sqsize; sr++) 
    {
        for (let sc = 0; sc < sqsize; sc++) 
        {
            let vals = new Set();
            for (let c = 0; c < sqsize; c++) 
            {
                for (let r = 0; r < sqsize; r++) 
                {
                    vals.add(s.get(sr * sqsize + r, sc * sqsize + c));
                }
            }
            fitness += vals.size;
        }
    }
    return fitness;
}


// Copyright (C) David Churchill - All Rights Reserved
// COMP3200 - 2022-09 - Assignment 4
// Written by David Churchill (dave.churchill@gmail.com)
// Unauthorized copying of these files are strictly prohibited
// Distributed only for course work at Memorial University
// If you see this file online please contact email above