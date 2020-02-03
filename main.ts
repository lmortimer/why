const assert = (condition: boolean): void => { if(!condition) throw new Error("Assertion failed") }
const log = console.log;
/*
 * 2.4 - Expressions
 * A lambda expression may be a:
 * - **name** to an identify an abstraction point
 * - **function** to introduce an abstraction
 * - **function application** to specialise an abstraction
 */

//type Name = string;
type Lambda = (x: any) => any;
//type LambdaApplicaton = (lambda: Lambda, parameter: Lambda) => any;

/*
 * 2.5.1
 */

const identity: Lambda = (x) => x;

// when the identity function is applied to itself we get another identity function
const identicalIdentity = identity(identity)
assert(identity === identicalIdentity);

// 2.5.2 - self application function, aka selfApply
const selfApply: Lambda = (func: Lambda) => func(func);

// applying the selfApplication to itself gives us infinite recursion
// we have no way of knowing whether a function will terminate at all
try {
    selfApply(selfApply)
} catch (e) {
    assert("Maximum call stack size exceeded" === e.message.trim());
}

// 2.5.3 - function application function, aka apply
const apply = (func: Lambda) =>
    (arg: any) => func(arg);

assert(3 === apply(identity)(3));

// 2.8 - functions from functions
const identity2 = (x: any) => {
    return apply(identity)(x);
}

assert(identity2(23) === identity(23));

const selfApply2 = (s: Lambda) => {
    return apply(s)(s);
}

const toTest = () => 23;

assert(selfApply2(toTest) == selfApply(toTest));


/* 
 * 2.9 -Argument selection & argument pairing.
 * Used as the building blocks for boolean logic, integer arithmetic, and list data structures
 */

const selectFirst = (first: any) => (second: any) => first
const selectSecond = (first: any) => (second: any) => second

assert(selectFirst("foo")("bar") == selectSecond("bar")("foo"));

const makePair = 
    (first: any) =>
        (second: any) =>
            (func: Lambda) => apply(func)(first)(second);

const examplePair = makePair("foo")("bar");

assert(examplePair(selectFirst) == "foo");
assert(examplePair(selectSecond) == "bar");

/* 
 * 2.10 Free and bound variables,
 * I think JS runtime takes care of this for us
 */ 

 /*
  * 3.1 Truth values and conditional expressions
  * Like the 'modern' ternary:
  *     `condition ? expr1 : expr2`
  */

// identical to makePair
const cond = 
    (expr1: any) =>
        (expr2: any) =>
            (condition: any) => condition(expr1)(expr2);


const TRUE = selectFirst
const FALSE = selectSecond

/* 
 * 3.2 NOT
 * We have a truth table
 * 
 *        X     |   NOT X
 *      ------------------
 *       FALSE  |  TRUE
 *       TRUE   |  FALSE
 * 
 * So NOT could be written as a conditional expression `X ? FALSE : TRUE`
 */

 const not = (x: any) => x(FALSE)(TRUE);

 assert(not(TRUE) == FALSE);
 assert(not(FALSE) == TRUE);

 /*
  * 3.3 AND
  */
