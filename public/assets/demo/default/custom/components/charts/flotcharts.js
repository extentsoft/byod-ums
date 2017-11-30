var FlotchartsDemo =
function () {
	var t = function () {
		for (var t = [], e = 0; e < 2 * Math.PI; e += .25)
			t.push([e, Math.sin(e)]);
		for (var o = [], e = 0; e < 2 * Math.PI; e += .25)
			o.push([e, Math.cos(e)]);
		for (var i = [], e = 0; e < 2 * Math.PI; e += .1)
			i.push([e, Math.tan(e)]);
		$.plot($("#m_flotcharts_1"), [{
					label: "sin(x)",
					data: t,
					lines: {
						lineWidth: 1
					},
					shadowSize: 0
				}, {
					label: "cos(x)",
					data: o,
					lines: {
						lineWidth: 1
					},
					shadowSize: 0
				}, {
					label: "tan(x)",
					data: i,
					lines: {
						lineWidth: 1
					},
					shadowSize: 0
				}
			], {
			series: {
				lines: {
					show: !0
				},
				points: {
					show: !0,
					fill: !0,
					radius: 3,
					lineWidth: 1
				}
			},
			xaxis: {
				tickColor: "#eee",
				ticks: [0, [Math.PI / 2, "π/2"], [Math.PI, "π"], [3 * Math.PI / 2, "3π/2"], [2 * Math.PI, "2π"]]
			},
			yaxis: {
				tickColor: "#eee",
				ticks: 10,
				min: -2,
				max: 2
			},
			grid: {
				borderColor: "#eee",
				borderWidth: 1
			}
		})
	},
	e = function () {
		function t() {
			return Math.floor(21 * Math.random()) + 20
		}
		function e(t, e, o) {
			$('<div id="tooltip">' + o + "</div>").css({
				position: "absolute",
				display: "none",
				top: e + 5,
				left: t + 15,
				border: "1px solid #333",
				padding: "4px",
				color: "#fff",
				"border-radius": "3px",
				"background-color": "#333",
				opacity: .8
			}).appendTo("body").fadeIn(200)
		}
		var o = [[1, t()], [2, t()], [3, 2 + t()], [4, 3 + t()], [5, 5 + t()], [6, 10 + t()], [7, 15 + t()], [8, 20 + t()], [9, 25 + t()], [10, 30 + t()], [11, 35 + t()], [12, 25 + t()], [13, 15 + t()], [14, 20 + t()], [15, 45 + t()], [16, 50 + t()], [17, 65 + t()], [18, 70 + t()], [19, 85 + t()], [20, 80 + t()], [21, 75 + t()], [22, 80 + t()], [23, 75 + t()], [24, 70 + t()], [25, 65 + t()], [26, 75 + t()], [27, 80 + t()], [28, 85 + t()], [29, 90 + t()], [30, 95 + t()]],
		i = [[1, t() - 5], [2, t() - 5], [3, t() - 5], [4, 6 + t()], [5, 5 + t()], [6, 20 + t()], [7, 25 + t()], [8, 36 + t()], [9, 26 + t()], [10, 38 + t()], [11, 39 + t()], [12, 50 + t()], [13, 51 + t()], [14, 12 + t()], [15, 13 + t()], [16, 14 + t()], [17, 15 + t()], [18, 15 + t()], [19, 16 + t()], [20, 17 + t()], [21, 18 + t()], [22, 19 + t()], [23, 20 + t()], [24, 21 + t()], [25, 14 + t()], [26, 24 + t()], [27, 25 + t()], [28, 26 + t()], [29, 27 + t()], [30, 31 + t()]],
		a = ($.plot($("#m_flotcharts_2"), [{
						data: o,
						label: "Unique Visits",
						lines: {
							lineWidth: 1
						},
						shadowSize: 0
					}, {
						data: i,
						label: "Page Views",
						lines: {
							lineWidth: 1
						},
						shadowSize: 0
					}
				], {
				series: {
					lines: {
						show: !0,
						lineWidth: 2,
						fill: !0,
						fillColor: {
							colors: [{
									opacity: .05
								}, {
									opacity: .01
								}
							]
						}
					},
					points: {
						show: !0,
						radius: 3,
						lineWidth: 1
					},
					shadowSize: 2
				},
				grid: {
					hoverable: !0,
					clickable: !0,
					tickColor: "#eee",
					borderColor: "#eee",
					borderWidth: 1
				},
				colors: ["#d12610", "#37b7f3", "#52e136"],
				xaxis: {
					ticks: 11,
					tickDecimals: 0,
					tickColor: "#eee"
				},
				yaxis: {
					ticks: 11,
					tickDecimals: 0,
					tickColor: "#eee"
				}
			}), null);
		$("#chart_2").bind("plothover", function (t, o, i) {
			if ($("#x").text(o.x.toFixed(2)), $("#y").text(o.y.toFixed(2)), i) {
				if (a != i.dataIndex) {
					a = i.dataIndex,
					$("#tooltip").remove();
					var r = i.datapoint[0].toFixed(2),
					l = i.datapoint[1].toFixed(2);
					e(i.pageX, i.pageY, i.series.label + " of " + r + " = " + l)
				}
			} else
				$("#tooltip").remove(), a = null
		})
	},
	o = function () {
		function t() {
			r = null;
			var t = l,
			e = plot.getAxes();
			if (!(t.x < e.xaxis.min || t.x > e.xaxis.max || t.y < e.yaxis.min || t.y > e.yaxis.max)) {
				var o,
				i,
				n = plot.getData();
				for (o = 0; o < n.length; ++o) {
					var s = n[o];
					for (i = 0; i < s.data.length && !(s.data[i][0] > t.x); ++i);
					var h,
					d = s.data[i - 1],
					c = s.data[i];
					h = null == d ? c[1] : null == c ? d[1] : d[1] + (c[1] - d[1]) * (t.x - d[0]) / (c[0] - d[0]),
					a.eq(o).text(s.label.replace(/=.*/, "= " + h.toFixed(2)))
				}
			}
		}
		for (var e = [], o = [], i = 0; i < 14; i += .1)
			e.push([i, Math.sin(i)]), o.push([i, Math.cos(i)]);
		plot = $.plot($("#m_flotcharts_3"), [{
						data: e,
						label: "sin(x) = -0.00",
						lines: {
							lineWidth: 1
						},
						shadowSize: 0
					}, {
						data: o,
						label: "cos(x) = -0.00",
						lines: {
							lineWidth: 1
						},
						shadowSize: 0
					}
				], {
				series: {
					lines: {
						show: !0
					}
				},
				crosshair: {
					mode: "x"
				},
				grid: {
					hoverable: !0,
					autoHighlight: !1,
					tickColor: "#eee",
					borderColor: "#eee",
					borderWidth: 1
				},
				yaxis: {
					min: -1.2,
					max: 1.2
				}
			});
		var a = $("#m_flotcharts_3 .legendLabel");
		a.each(function () {
			$(this).css("width", $(this).width())
		});
		var r = null,
		l = null;
		$("#m_flotcharts_3").bind("plothover", function (e, o, i) {
			l = o,
			r || (r = setTimeout(t, 50))
		})
	},
	a = function () {
		function t() {
			for (o.length > 0 && (o = o.slice(1)); o.length < i; ) {
				var t = (o.length > 0 ? o[o.length - 1] : 50) + 10 * Math.random() - 5;
				t < 0 && (t = 0),
				t > 100 && (t = 100),
				o.push(t)
			}
			for (var e = [], a = 0; a < o.length; ++a)
				e.push([a, o[a]]);
			return e
		}
		function e() {
			r.setData([t()]),
			r.draw(),
			setTimeout(e, a)
		}
		var o = [],
		i = 250,
		a = 30,
		r = $.plot($("#m_flotcharts_4"), [t()], {
				series: {
					shadowSize: 1
				},
				lines: {
					show: !0,
					lineWidth: .5,
					fill: !0,
					fillColor: {
						colors: [{
								opacity: .1
							}, {
								opacity: 1
							}
						]
					}
				},
				yaxis: {
					min: 0,
					max: 100,
					tickColor: "#eee",
					tickFormatter: function (t) {
						return t + "%"
					}
				},
				xaxis: {
					show: !1
				},
				colors: ["#6ef146"],
				grid: {
					tickColor: "#eee",
					borderWidth: 0
				}
			});
		e()
	},
	r = function () {
		function t() {
			$.plot($("#m_flotcharts_5"), [{
						label: "sales",
						data: e,
						lines: {
							lineWidth: 1
						},
						shadowSize: 0
					}, {
						label: "tax",
						data: i,
						lines: {
							lineWidth: 1
						},
						shadowSize: 0
					}, {
						label: "profit",
						data: a,
						lines: {
							lineWidth: 1
						},
						shadowSize: 0
					}
				], {
				series: {
					stack: r,
					lines: {
						show: n,
						fill: !0,
						steps: s,
						lineWidth: 0
					},
					bars: {
						show: l,
						barWidth: .5,
						lineWidth: 0,
						shadowSize: 0,
						align: "center"
					}
				},
				grid: {
					tickColor: "#eee",
					borderColor: "#eee",
					borderWidth: 1
				}
			})
		}
		for (var e = [], o = 0; o <= 10; o += 1)
			e.push([o, parseInt(30 * Math.random())]);
		for (var i = [], o = 0; o <= 10; o += 1)
			i.push([o, parseInt(30 * Math.random())]);
		for (var a = [], o = 0; o <= 10; o += 1)
			a.push([o, parseInt(30 * Math.random())]);
		var r = 0,
		l = !0,
		n = !1,
		s = !1;
		$(".stackControls input").click(function (e) {
			e.preventDefault(),
			r = "With stacking" == $(this).val() || null,
			t()
		}),
		$(".graphControls input").click(function (e) {
			e.preventDefault(),
			l = -1 != $(this).val().indexOf("Bars"),
			n = -1 != $(this).val().indexOf("Lines"),
			s = -1 != $(this).val().indexOf("steps"),
			t()
		}),
		t()
	},
	l = function () {
		var t = function (t) {
			var e = [],
			o = 100 + t,
			a = 200 + t;
			for (i = 1; i <= 20; i++) {
				var r = Math.floor(Math.random() * (a - o + 1) + o);
				e.push([i, r]),
				o++,
				a++
			}
			return e
		}
		(0);
		$.plot($("#m_flotcharts_6"), [{
					data: t,
					lines: {
						lineWidth: 1
					},
					shadowSize: 0
				}
			], {
			series: {
				bars: {
					show: !0
				}
			},
			bars: {
				barWidth: .8,
				lineWidth: 0,
				shadowSize: 0,
				align: "left"
			},
			grid: {
				tickColor: "#eee",
				borderColor: "#eee",
				borderWidth: 1
			}
		})
	},
	n = function () {
		
		$.plot($("#m_flotcharts_7"), [[[2510,10], [2511,20], [2512,30], [2513,40], [2514,50]]], {
			series: {
				bars: {
					show: !0
				}
			},
			bars: {
				horizontal: 0,
				barWidth: 1,
				lineWidth: 1,
				shadowSize: 0,
				align: "left"
			},
			grid: {
				tickColor: "#eee",
				borderColor: "#eee",
				borderWidth: 1
			}
		})
	},
	s = function () {
		var t = [],
		e = Math.floor(10 * Math.random()) + 1;
		e = e < 5 ? 5 : e;
		for (var o = 0; o < e; o++)
			t[o] = {
				label: "Series" + (o + 1),
				data: Math.floor(100 * Math.random()) + 1
			};
		$.plot($("#m_flotcharts_8"), t, {
			series: {
				pie: {
					show: !0
				}
			}
		})
	},
	h = function () {
		var t = [],
		e = Math.floor(10 * Math.random()) + 1;
		e = e < 5 ? 5 : e;
		for (var o = 0; o < e; o++)
			t[o] = {
				label: "Series" + (o + 1),
				data: Math.floor(100 * Math.random()) + 1
			};
		$.plot($("#m_flotcharts_9"), t, {
			series: {
				pie: {
					show: !0
				}
			},
			legend: {
				show: !1
			}
		})
	},
	d = function () {
		var t = [],
		e = Math.floor(10 * Math.random()) + 1;
		e = e < 5 ? 5 : e;
		for (var o = 0; o < e; o++)
			t[o] = {
				label: "Series" + (o + 1),
				data: Math.floor(100 * Math.random()) + 1
			};
		$.plot($("#m_flotcharts_10"), t, {
			series: {
				pie: {
					show: !0,
					radius: 1,
					label: {
						show: !0,
						radius: 1,
						formatter: function (t, e) {
							return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">' + t + "<br/>" + Math.round(e.percent) + "%</div>"
						},
						background: {
							opacity: .8
						}
					}
				}
			},
			legend: {
				show: !1
			}
		})
	},
	c = function () {
		var device = [{"endpointOS":"Windows","amount":"130"},{"endpointOS":"Linux","amount":"41"},{"endpointOS":"iOS","amount":"81"},{"endpointOS":"Android","amount":"75"},{"endpointOS":"WindowsPhone","amount":"13"}];
		//alert(device.length)
		//alert(JSON.stringify(device[0].endpointOS));
		var t = [],
		//e = Math.floor(10 * Math.random()) + 1;
		//e = e < 5 ? 5 : e;
		e = device.length;
		for (var o = 0; o < e; o++)
			t[o] = {
				//label: "Series" + (o + 1),
				label: device[o].endpointOS,
				//data: Math.floor(100 * Math.random()) + 1
				data: device[o].amount
			};
		$.plot($("#m_flotcharts_11"), t, {
			series: {
				pie: {
					show: !0,
					radius: 1,
					label: {
						show: !0,
						radius: 1,
						formatter: function (t, e) {
							//return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">' + t + "<br/>" + Math.round(e.percent) + "%</div>"
							return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">' + t + "<br/>" + e.data[0][1] + "<br/>" + Math.round(e.percent) + "%</div>"
						},
						background: {
							opacity: .8
						}
					}
				}
			},
			legend: {
				show: !1
			}
		})
	},
	c1 = function () {
		var site = [{"siteName":"Headquarters","amountOfuser":"154"},{"siteName":"Bangkok","amountOfuser":"65"},{"siteName":"KhonKaen","amountOfuser":"35"},{"siteName":"Pathumthani","amountOfuser":"41"},{"siteName":"Phuket","amountOfuser":"21"}];
		//alert(device.length)
		//alert(JSON.stringify(device[0].endpointOS));
		var t = [],
		//e = Math.floor(10 * Math.random()) + 1;
		//e = e < 5 ? 5 : e;
		e = site.length;
		for (var o = 0; o < e; o++)
			t[o] = {
				//label: "Series" + (o + 1),
				label: site[o].siteName,
				//data: Math.floor(100 * Math.random()) + 1
				data: site[o].amountOfuser
			};
		$.plot($("#m_flotcharts_001"), t, {
			series: {
				pie: {
					show: !0,
					radius: 1,
					label: {
						show: !0,
						radius: 1,
						formatter: function (t, e) {
							//return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">' + t + "<br/>" + Math.round(e.percent) + "%</div>"
							return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">' + t + "<br/>" + e.data[0][1] + "<br/>" + Math.round(e.percent) + "%</div>"
						},
						background: {
							opacity: .8
						}
					}
				}
			},
			legend: {
				show: !1
			}
		})
	};
	return {
		init: function () {
			t(),
			e(),
			o(),
			a(),
			r(),
			l(),
			n(),
			s(),
			//h(),
			d(),
			c(),
			c1()
		}
	}
}
();
jQuery(document).ready(function () {
	FlotchartsDemo.init()
});