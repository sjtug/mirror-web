---
---
$(document).ready(() => {
var mir_tmpl = $("#template").text(),
	label_map = {
		'unknown': 'label-default',
		'syncing': 'label-info',
		'success': 'label-success',
		'fail': 'label-warning'
	}, 
	help_url = {
		{% for h in site.categories['help'] %}"{{h.mirrorid}}": "{{h.url}}"{% if forloop.index < forloop.length %},{% endif %}{% endfor %}
	},
	new_mirrors = {
		{% for n in site.new_mirrors %}"{{n}}": true{% if forloop.index < forloop.length %},{% endif %}{% endfor %}
	},
	unlisted = [
	],
	options = {
		'AOSP': {
			'url': "/help/AOSP/",
		}
	};

window.refreshMirrorList = () => {
	$.getJSON("/static/tunasync.json", (status_data) => {
		var mirrors = [], mir_data = $.merge(status_data, unlisted);
		
		mir_data.sort((a, b) => { return a.name < b.name ? -1: 1 });

		for(var k in mir_data) {
			var d = mir_data[k];
			if (options[d['name']] != undefined ) {
				d = $.extend(d, options[d['name']]);
			}
			d['label'] = label_map[d['status']];
			d['help_url'] = help_url[d['name']];
			d['is_new'] = new_mirrors[d['name']];
			d['show_status'] = (d.status != "success");
			// Strip the second component of last_update
			d['last_update'] = d['last_update'].replace(/(\d\d:\d\d):\d\d/, '$1');
			mirrors.push(d);
		}
		var result = Mark.up(mir_tmpl, {mirrors: mirrors});
		$('#mirror-list').html(result);
	});
	setTimeout(refreshMirrorList, 10000);
}
refreshMirrorList();

$.getJSON("/static/tunet.json", (to_alert) => {
	if (to_alert) {
		$('#thu-alert').removeClass('hidden');
	};
});

});

// vim: ts=2 sts=2 sw=2 noexpandtab
