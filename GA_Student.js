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
//  Group Member(s): Ekuyik Essien enessien@mun.ca #202023347, Matthew Keough mkeough18@mun.ca #201800737
//
///\/\/\\\\//\\/\/\/\\/\\///\\////\/\/\\\\//\\/\/\/\\/\\///\\///

// Note: population is an array of JavaScript objects containing two variables
//       { gene: [array of integer values], fitness: number }
//       - population[i].gene    = 1D array representation of the individual (genotype)
//       - population[i].fitness = fitness of the invidivual (calculated when added to population)
function GAEvolve(population, settings) 
{
    // 1. Set up a new array which will hold the next population
  
    let nextPopulation = [];
    
    // 2. Sort the population descending based on fitness 
    population.sort((a, b) => b.fitness - a.fitness);
    
    // 3. Add the top N elite (top fitness) individuals to the next population
    //    The percentage of elite genes to carry over is given in settings.elitismRatio
    let top = settings.elitismRatio * population.length;
    let e = 0;
    while (e < top)
    {
        nextPopulation.push(population[e]);
        e++;
    }

    // 4. Add the required number of random individuals to the next population
    //    The percentage of random genes to carry over is given in settings.randomRatio
    let rand = settings.randomRatio * population.length;
    for (let r = 0; r < rand; r++)
    {
        let geneVariable = [];
        // create new complete random gene
        for (let g=0; g<population[0].gene.length; g++)
        {
            // You can get a random gene value by calling settings.getRandomGeneValue()

            geneVariable.push(settings.getRandomGeneValue());
            
        }
        // Make sure you add the following Object to the array whenever adding an individual
        nextPopulation.push({ gene: geneVariable, fitness: settings.fitnessFunction(geneVariable) });
    }

    // 5. Perform the child generation process, which is as follows:
    // compute the sum of all the fitnesses in the population
    let fitnessSum = 0;
    for (let i=0; i<population.length; i++)
    {
        fitnessSum += population[i].fitness;
    }

    // we keep adding children until we fill the next population
    // the nextPopulation array should always be the same length as settings.populationSize
    while (nextPopulation.length < settings.populationSize)
    {
        let parent1 = RouletteWheelSelection(population, fitnessSum);
        let parent2 = RouletteWheelSelection(population, fitnessSum);

        let child1  = CrossOver(parent1, parent2, settings);
        let child2  = CrossOver(parent2, parent1, settings);

        MutateIndividual(child1, settings);
        MutateIndividual(child2, settings);
        // Add the children to the population
        nextPopulation.push(child1);
        // Be careful not to add child2 if it would go above the population size
        if(nextPopulation.length != settings.populationSize)
        {
            nextPopulation.push(child2);
        }
    }
    return nextPopulation;
}

// Select a parent individual from a population based on roulette wheel selection
function RouletteWheelSelection(population, fitnessSum) 
{
    pick = Math.floor(Math.random() * fitnessSum);
    // use the algorithm from the slides
    let selectedIndex = 0;
    let current = 0;
    for (i = 0;i<population.length;i++){
        current += population[i].fitness;
        if (current > pick){
            selectedIndex = i;
            break;
        }
    }
    return population[selectedIndex];
}

// Perform crossover on two parent individuals and return the child individual
function CrossOver(parent1, parent2, settings) 
{
    let childGene = [];
    // add the first half of parent1 gene to childGene
    let half = Math.floor((parent1.gene.length-1) / 2); // one left of midpoint if not exact half
    for (let i=0; i<half; i++)
    {
        childGene.push(parent1.gene[i]);
    }
    // add the second half of parent2 gene to childGene
    let total = parent2.gene.length // one right of midpoint if not exact half
    for (let i=half; i<total; i++)
    {
        childGene.push(parent2.gene[i]);
    }
    return { gene: childGene, fitness: settings.fitnessFunction(childGene) };
}

// Mutate an individual based on the settings mutation rate
function MutateIndividual(individual, settings)
{
    // mutation chance = if (random number between [0,1] is < settings.mutationRate)
    let chance = Math.random();
    if (chance < settings.mutationRate)
    {
        // mutation changes a random index of the gene to settings.getRandomGeneValue()
        // random index in range form 0 to gene length
        let randIndex = Math.floor(Math.random() * (individual.gene.length));
        console.log(randIndex);
        individual.gene[randIndex] = settings.getRandomGeneValue();
    }
    // this function modifies the individual and returns nothing
}
                                                   
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
        fitness += vals.size * 100;
    }
    // add unique values in each column
    for (let c = 0; c < size; c++) 
    {
        let vals = new Set();
        for (let r = 0; r < size; r++) 
        {
            vals.add(s.get(r, c));
        }
        fitness += vals.size * 100;
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
            fitness += vals.size * 100;
        }
    }
    for (let r = 0; r < size; r++) 
    {
        let unfit = 0;
        for (let c = 0; c < size; c++) 
        {
            // we reduce the fitness based on the level of unfit
            unfit = s.numConflicts(r, c);
            if (unfit == 1){
                fitness -= 10
            }
            if (unfit == 2){
                fitness -= 20
            }
            if (unfit == 3){
                fitness -= 30
            }
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
