import Joi from "joi";

const print = (thing) => {
  process.stdout.write(JSON.stringify(thing, null, 2));
}

/**
 * One date cannot be before another
 */

const exampleOne = Joi.object({
  startDate: Joi.date(),
  endDate: Joi.date().greater(Joi.ref('startDate')).rule({message: "The endDate can not occur before the startDate"})
});

const now = new Date();
const tenSeconds = 10 * 1000;
// JOI will throw this out because the endDate is ten seconds before the start date
// "The endDate can not occur before the startDate"
exampleOne.validate({ startDate: now.toISOString(), endDate: new Date(Date.now() - tenSeconds).toISOString() })

// Passes, endDate is after startDate
exampleOne.validate({ startDate: now.toISOString(), endDate: new Date(Date.now() + tenSeconds).toISOString() })

/**
 * One date cannot be before another, but either can be null
 */

const exampleTwo = Joi.object({
  startDate: Joi.date().allow(null),
  endDate: Joi.date().greater(Joi.ref('startDate')).allow(null).rule({message: "The endDate can not occur before the startDate"})
});

// Fails because endDate is before startDate
exampleTwo.validate({ startDate: now.toISOString(), endDate: new Date(Date.now() - tenSeconds).toISOString() })

// Both can be null
exampleTwo.validate({ startDate: null, endDate: null }) // passes

// Passes because startDate is null
exampleTwo.validate({ startDate: null, endDate: now.toISOString() })

// Passes because startDate is null
exampleTwo.validate({ startDate: now.toISOString(), endDate: null })

// Passes because startDate isn't required
exampleTwo.validate({ endDate: null })

