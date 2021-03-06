import { Nothing, Just } from './Maybe'
import { Either, Left, Right } from './Either'

const anything = Math.random()

describe('Either', () => {
    test('of', () => {
        expect(Either.of(5)).toEqual(Right(5))
    })

    test('lefts', () => {
        expect(Either.lefts([Left('Error'), Left('Error2'), Right(5)])).toEqual(['Error', 'Error2'])
    })

    test('rights', () => {
        expect(Either.rights([Right(10), Left('Error'), Right(5)])).toEqual([10, 5])
    })

    test('encase', () => {
        expect(Either.encase(() => { throw new Error('a') })).toEqual(Left(new Error('a')))
        expect(Either.encase(() => 10)).toEqual(Right(10))
    })

    test('isLeft', () => {
        expect(Left(anything).isLeft()).toEqual(true)
        expect(Right(anything).isLeft()).toEqual(false)
    })

    test('isRight', () => {
        expect(Left(anything).isRight()).toEqual(false)
        expect(Right(anything).isRight()).toEqual(true)
    })

    test('bimap', () => {
        expect(Left('Error').bimap(x => x + '!', x => x + 1)).toEqual(Left('Error!'))
        expect(Right(5).bimap(x => x + '!', x => x + 1)).toEqual(Right(6))
    })

    test('map', () => {
        expect(Left('Error').map(x => x + 1)).toEqual(Left('Error'))
        expect(Right(5).map(x => x + 1)).toEqual(Right(6))
    })

    test('mapLeft', () => {
        expect(Left('Error').mapLeft(x => x + '!')).toEqual(Left('Error!'))
        expect(Right(5).mapLeft(x => x + '!')).toEqual(Right(5))
    })

    test('ap', () => {
        expect(Right(5).ap(Right((x: number) => x + 1))).toEqual(Right(6))
        expect(Right(5).ap(Left('Error' as never))).toEqual(Left('Error'))
        expect(Left('Error').ap(Right((x: number) => x + 1))).toEqual(Left('Error'))
        expect(Left('Error').ap(Left('Function Error'))).toEqual(Left('Function Error'))
    })

    test('equals', () => {
        expect(Left('Error').equals(Left('Error'))).toEqual(true)
        expect(Left('Error').equals(Left('Error!'))).toEqual(false)
        expect(Left('Error').equals(Right('Error') as any)).toEqual(false)
        expect(Right(5).equals(Right(5))).toEqual(true)
        expect(Right(5).equals(Right(6))).toEqual(false)
        expect(Right(5).equals(Left('Error') as any)).toEqual(false)
    })

    test('lte', () => {
        expect(Left(5).lte(Left(6))).toEqual(true)
        expect(Left(5).lte(Left(3))).toEqual(false)
        expect(Left(5).lte(Right(6) as any)).toEqual(false)
        expect(Right(5).lte(Right(6))).toEqual(true)
        expect(Right(5).lte(Right(3))).toEqual(false)
        expect(Right(5).lte(Left(6) as any)).toEqual(false)
    })

    test('concat', () => {
        expect(Right([1,2]).concat(Right([3,4]))).toEqual(Right([1,2,3,4]))
        expect(Right([1,2]).concat(Left('Error') as any)).toEqual(Right([1,2]))
        expect(Left('Error').concat(Right([1, 2]) as any)).toEqual(Right([1,2]))
    })

    test('chain', () => {
        expect(Left('Error').chain(x => Right(x + 1))).toEqual(Left('Error'))
        expect(Right(5).chain(x => Right(x + 1))).toEqual(Right(6))
    })

    test('alt', () => {
        expect(Left('Error').alt(Left('Error!'))).toEqual(Left('Error!'))
        expect(Left('Error').alt(Right(5) as any)).toEqual(Right(5))
        expect(Right(5).alt(Left('Error') as any)).toEqual(Right(5))
        expect(Right(5).alt(Right(6))).toEqual(Right(5))
    })

    test('reduce', () => {
        expect(Right(5).reduce((acc, x) => x * acc, 2)).toEqual(10)
        expect(Left('Error').reduce((acc, x) => x * acc, 0)).toEqual(0)
    })

    test('extend', () => {
        expect(Left('Error').extend(x => x.isRight())).toEqual(Left('Error'))
        expect(Right(5).extend(x => x.isRight())).toEqual(Right(true))
    })

    test('unsafeCoerce', () => {
        expect(Right(5).unsafeCoerce()).toEqual(5)
        expect(() => Left('Error').unsafeCoerce()).toThrow()
    })

    test('caseOf', () => {
        expect(Left('Error').caseOf({ Left: x => x, Right: () => 'No error' })).toEqual('Error')
        expect(Right(6).caseOf({ Left: _ => 0, Right: x => x + 1 })).toEqual(7)
    })

    test('leftOrDefault', () => {
        expect(Left('Error').leftOrDefault('No error')).toEqual('Error')
        expect(Right(5).leftOrDefault('No error' as never)).toEqual('No error')
    })

    test('orDefault', () => {
        expect(Left('Error').orDefault(0 as never)).toEqual(0)
        expect(Right(5).orDefault(0)).toEqual(5)
    })

    test('ifLeft', () => {
        let a = 0
        Left('Error').ifLeft(() => { a = 5})
        expect(a).toEqual(5)

        let b = 0
        Right(5).ifLeft(() => { b = 5 })
        expect(b).toEqual(0)
    })

    test('ifRight', () => {
        let a = 0
        Left('Error').ifRight(() => { a = 5 })
        expect(a).toEqual(0)

        let b = 0
        Right(5).ifRight(() => { b = 5 })
        expect(b).toEqual(5)
    })

    test('toMaybe', () => {
        expect(Left('Error').toMaybe()).toEqual(Nothing)
        expect(Right(5).toMaybe()).toEqual(Just(5))
    })

    test('leftToMaybe', () => {
        expect(Left('Error').leftToMaybe()).toEqual(Just('Error'))
        expect(Right(5).leftToMaybe()).toEqual(Nothing)
    })

    test('either', () => {
        expect(Right(5).either(_ => 0, x => x + 1)).toEqual(6)
        expect(Left('Error').either(x => x + '!', _ => '')).toEqual('Error!')
    })

    test('extract', () => {
        expect(Right(5).extract()).toEqual(5)
        expect(Left('Error').extract()).toEqual('Error')
    })
})