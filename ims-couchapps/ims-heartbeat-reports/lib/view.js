exports.views = {
	memory_daily : {
		map : function(doc) {
			if (doc.daily) {
				var mem = doc.daily.memory_used / doc.daily.count;
				mem = parseInt(mem.toFixed(2));
				emit(mem, doc.hostname);
			}
		}
	},
	memory_monthly : {
		map : function(doc) {
			if (doc.monthly) {
				var mem = doc.monthly.memory_used / doc.monthly.count;
				mem = parseInt(mem.toFixed(2));
				emit(mem, doc.hostname);
			}
		}
	},
	memory_yearly : {
		map : function(doc) {
			if (doc.yearly) {
				var mem = doc.yearly.memory_used / doc.yearly.count;
				mem = parseInt(mem.toFixed(2));
				emit(mem, doc.hostname);
			}
		}
	},
	memory_weekly : {
		map : function(doc) {
			if (doc.weekly) {
				var mem = doc.weekly.memory_used / doc.weekly.count;
				mem = parseInt(mem.toFixed(2));
				emit(mem, doc.hostname);
			}
		}
	},
	cpu_daily : {
		map : function(doc) {
			if (doc.daily) {
				var cpu = doc.daily.cpu / doc.daily.count;
				cpu = parseInt(cpu.toFixed(2));
				emit(cpu, doc.hostname);
			}
		}
	},
	cpu_monthly : {
		map : function(doc) {
			if (doc.monthly) {
				var cpu = doc.monthly.cpu / doc.monthly.count;
				cpu = parseInt(cpu.toFixed(2));
				emit(cpu, doc.hostname);
			}
		}
	},
	cpu_yearly : {
		map : function(doc) {
			if (doc.yearly) {
				var cpu = doc.yearly.cpu / doc.yearly.count;
				cpu = parseInt(cpu.toFixed(2));
				emit(cpu, doc.hostname);
			}
		}
	},
	cpu_weekly : {
		map : function(doc) {
			if (doc.weekly) {
				var cpu = doc.weekly.cpu / doc.weekly.count;
				cpu = parseInt(cpu.toFixed(2));
				emit(cpu, doc.hostname);
			}
		}
	},
	use_daily : {
		map : function(doc) {
			if (doc.daily) {
				var mem = doc.daily.memory_used / doc.daily.count;
				mem = parseInt(mem.toFixed(2));
				var cpu = doc.daily.cpu / doc.daily.count;
				cpu = parseInt(cpu.toFixed(2));
				emit(cpu + mem, doc.hostname);
			}
		}
	},
	use_monthly : {
		map : function(doc) {
			if (doc.monthly) {
				var cpu = doc.monthly.cpu / doc.monthly.count;
				cpu = parseInt(cpu.toFixed(2));
				var mem = doc.monthly.memory_used / doc.monthly.count;
				mem = parseInt(mem.toFixed(2));
				emit(cpu + mem, doc.hostname);
			}
		}
	},
	use_yearly : {
		map : function(doc) {
			if (doc.yearly) {
				var cpu = doc.yearly.cpu / doc.yearly.count;
				cpu = parseInt(cpu.toFixed(2));
				var mem = doc.yearly.memory_used / doc.yearly.count;
				mem = parseInt(mem.toFixed(2));
				emit(cpu + mem, doc.hostname);
			}
		}
	},
	use_weekly : {
		map : function(doc) {
			if (doc.weekly) {
				var cpu = doc.weekly.cpu / doc.weekly.count;
				cpu = parseInt(cpu.toFixed(2));
				var mem = doc.weekly.memory_used / doc.weekly.count;
				mem = parseInt(mem.toFixed(2));
				emit(cpu + mem, doc.hostname);
			}
		}
	},
	no_heartbeat : {
		map : function(doc) {
			var time = new Date();
			if (time.getUTCHours() != doc.heartbeat[3])
				emit(doc.heartbeat, doc.hostname);
		}
	}

};