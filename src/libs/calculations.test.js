import { getDegrees, getRadians, decreasePower } from './calculations'



describe('Calculations', () => {

  it('getDegrees',()=>{
    expect(getDegrees(1)).toBe(57.29577951308232)
  })


  it('getRadians',()=>{
    expect(getRadians(57.29577951308232)).toBe(1)
  })


  it('decreasePower',()=>{
    expect(decreasePower(60, 100, 150)).toBe(113.33333333333333)
    expect(decreasePower(60, 10, 150)).toBe(11.333333333333332)
  })




})
