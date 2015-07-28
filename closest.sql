SET @t=UNIX_TIMESTAMP("2015-07-22 11:53:42");

SELECT * from tagreads where abs(UNIX_TIMESTAMP(readtime) - @t)=(
	SELECT min(abs(@t-UNIX_TIMESTAMP(readtime))) from tagreads
);