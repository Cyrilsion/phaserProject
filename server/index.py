# coding: utf-8

import cgi 

form = cgi.FieldStorage()
print("Content-type: text/html; charset=utf-8\n")

html = """<!DOCTYPE html>
<head>
	<meta charset="UTF-8">
	<link href="./style/menucombat.css" rel="stylesheet" media="all" type="text/css"> 
</head>
<body>
	<div id = "visuel">
	</div>
	<script type="text/javascript" src="./lib/phaser-custom.min.js"></script>
	<script type="text/javascript" src="./dist/bundle.js"></script>
</body>
</html>
"""
print(html)