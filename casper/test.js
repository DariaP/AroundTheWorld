casper.test.begin("Hello, Test!", 1, function(test) {
  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    test.assertTitle("Around the world", "title is the one expected");
  });

  casper.run(function() {
    test.done();
  });
});
