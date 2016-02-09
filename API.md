### GET /data/:index

匿名、不登入

```
{
	title: String,
	choices: [{name: String, voters: [{anonymous: true, name: ""}...]}...]
}
```

不匿名

```
{
	title: String,
	choices: [{name: String, voters: [{anonymous: false, name: String}...]}...]
}
```


### POST /update/:index
