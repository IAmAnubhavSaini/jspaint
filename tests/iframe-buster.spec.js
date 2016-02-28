describe('iFrameBuster should be activated by now;', function(){
  it('but since we are not in the browser iframe activationStatus should be false.', function(){
    expect(iFrameBuster.isActivated()).toBe(false);
  });
});
