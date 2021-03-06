$.extend(trophies, {

	/**
	 * If enabled, then we should the cups + totals + trophy level in the mini profile.
	 *
	 * @param {Boolean} page_ran If true, then the user lookup table doesn't get refreshed.
	 */

	show_in_mini_profile: function(page_ran){
		var minis = yootil.get.mini_profiles();

		if(minis && minis.length){

			// Has this mini profile already been processed?
			// Due to AJAX caching, we need to check this.

			if(minis.find("div.trophies-mini-profile").length){
				return;
			}

			if(!page_ran){
				this.refresh_user_data_table();
			}

			var self = this;

			minis.each(function(){
				var user_link = $(this).find("a.user-link[href*='user']:first");

				if(user_link && user_link.length){
					var user_id_match = user_link.attr("href").match(/\/user\/(\d+)\/?/i);

					if(user_id_match && user_id_match.length == 2){
						var user_id = parseInt(user_id_match[1]);

						if(!user_id){
							return;
						}

						// Also test for custom class.

						var elem = ($(this).find(".trophies-custom-mini-profile").length == 1)? $(this).find(".trophies-custom-mini-profile") : $(this).find(".info");

						if(elem && elem.length){
							elem.append(self.create_stats(user_id));
						}
					}
				}
			});
		}
	},

	/**
	 * Here we create the stats for the mini profile.
	 *
	 * @param {Number} user_id The user we want to create stats for
	 * @return {Object}
	 */

	create_stats: function(user_id){
		var data = this.data(user_id);
		var html = "<div class='trophies-mini-profile'>";

		// This is not called every page, only when needed, so
		// we have to manually call this.

		data.calculate_stats();

		// Current trophy level

		if(this.settings.show_mini_profile_current_level){
			html += "<span class='trophies-tiptip trophies-mini-profile-level' title='Trophy Level'>Trophy Level: " + data.get.stat.current_level() + "</span><br />";
		}

		// Total trophies earned

		if(this.settings.show_mini_profile_total_trophies){
			html += "<span class='trophies-tiptip trophies-mini-profile-total' title='Total Trophies'>Total Trophies: " + data.get.stat.total_trophies() + "</span><br />";

		}

		// Cups with their totals

		if(this.settings.show_mini_profile_total_cups){
			html += "<div class='trophies-mini-profile-cups'>";
			html += "<span class='trophies-tiptip trophies-mini-profile-cup' title='Bronze'><img src='" + this.images.bronze + "' /> x " + data.get.stat.cups.bronze() + "</span>";
			html += "<span class='trophies-tiptip trophies-mini-profile-cup' title='Silver'><img src='" + this.images.silver + "' /> x " + data.get.stat.cups.silver() + "</span>";
			html += "<span class='trophies-tiptip trophies-mini-profile-cup' title='Gold'><img src='" + this.images.gold + "' /> x " + data.get.stat.cups.gold() + "</span>";
			html += "</div>";
		}

		html += "</div>";

		return $(html);
	}

});