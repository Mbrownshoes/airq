build/airzones.geojson:
	mkdir -p $(dir $@)
	curl -o $@ https://catalogue.data.gov.bc.ca/dataset/e8eeefc4-2826-47bc-8430-85703d328516/resource/c495d082-b586-4df0-9e06-bd6b66a8acd9/download/bcairzones.geojson


# bc albers projection 
# build/az.json: build/airzones.geojson
# 	ogr2ogr -f GeoJSON -t_srs "+proj=aea +lat_1=50 +lat_2=58.5 +lat_0=45 +lon_0=-126 +x_0=1000000 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs  " \
# 	build/az.json \
# 	build/airzones.geojson

# geoproject 'd3.geoAlbersUsa()' build/airzones.geojson \
#   > us-albers.json

build/bc.json:build/airzones.geojson 
	geoproject 'd3.geoAlbers().parallels([50, 58.5]).rotate([126, 0]).center([0,50.5]).fitSize([960, 600], d)'  < "$<" > "$@"


# one feature per line
# bc.ndjson: bc.json
# 	ndjson-split 'd.features' < "$<" > "$@"

bc_topo.json: build/bc.json
	geo2topo build/bc.json > bc_topo.json

# topojson without projection - using this until I can figure out how to align pre-projected and on the fly projected features
bc_no_proj.json:build/airzones.geojson 
	geo2topo build/airzones.geojson  > bc_no_proj.json


# build/ne_110m_ocean.zip:
# 	mkdir -p build
# 	curl -o $@ --raw 'http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/physical/ne_110m_ocean.zip'
shp2json build/ne_110m_ocean.shp -o ocean.json

oceanTopo.json:ocean.json 
	geo2topo ocean.json  > oceanTopo.json


# airzones.json: build/az.json
# 	node_modules/.bin/topojson \
# 		--width 960 \
# 	    --height 600 \
# 	    --properties='zone=Airzone' \
# 	    --properties='zoneNum=id' \
# 		-o $@ \
# 		-- skulldist=$<


# build/gpr_000b11a_e.shp: build/gpr_000b11a_e.zip
# 	unzip -od $(dir $@) $<
# 	touch $@

# prov.json: build/gpr_000b11a_e.shp
# 	node_modules/.bin/topojson \
# 		-o $@ \
# 		--projection='width = 960, height = 600, d3.geo.albers() \
# 			.rotate([96, 0]) \
# 		    .center([-32, 53.9]) \
# 		    .parallels([20, 60]) \
# 		    .scale(1970) \
# 		    .translate([width / 2, height / 2])' \
# 	    --properties='province=PRENAME' \
# 		--simplify=0.5 \
# 		-- prov=$<

# build/subunits.json: build/Boundaries/CD_2011.shp
# 	ogr2ogr -f GeoJSON  -t_srs "+proj=latlong +datum=WGS84" \
# 	build/subunits.json \
# 	build/Boundaries/CD_2011.shp

	# ogr2ogr -f GeoJSON  -t_srs "+proj=latlong +datum=WGS84" -where "CDNAME IN ('Alberni-Clayoquot')" \
	# -clipdst -125.1550643102 48.8344612907 -126.1800723924 49.2711484127 \
	# build/subunits.json \
	# build/Boundaries/CD_2011.shp

# census.json: build/subunits.json
# 	node_modules/.bin/topojson \
# 		-o $@ \
# 		--projection='width = 960, height = 600, d3.geo.albers() \
# 			.rotate([96, 5]) \
# 		    .center([-32, 58.5]) \
# 		    .parallels([20, 60]) \
# 		    .scale(1970) \
# 		    .translate([width / 2, height / 2])' \
# 	    --properties='zone=CDNAME' \
# 	    --simplify=0.05 \
# 		-- census=$<



# build/regdist.json: build/BCGW_78757263_1463523821534_3336/ABMS_RD/ABMS_RD_polygon.shp
# 	ogr2ogr -f GeoJSON  -t_srs "+proj=latlong +datum=WGS84" \
# 	build/regdist.json \
# 	build/BCGW_78757263_1463523821534_3336/ABMS_RD/ABMS_RD_polygon.shp

# #https://catalogue.data.gov.bc.ca/dataset/legally-defined-administrative-areas-of-bc
# build/adminAreas.json: build/ABMS_LAA/ABMS_LAA_polygon.shp
# 	ogr2ogr -f GeoJSON  -t_srs "+proj=latlong +datum=WGS84" \
# 	-where "AA_TYPE IN ('Regional District')" \
# 	build/adminAreas.json \
# 	build/ABMS_LAA/ABMS_LAA_polygon.shp

# #stats can shape
# build/censusDivs.json: build/gcd_000b11a_e/gcd_000b11a_e.shp
# 	ogr2ogr -f GeoJSON  -t_srs "+proj=latlong +datum=WGS84" \
# 	-where "PRUID IN ('59')" \
# 	build/censusdivs.json \
# 	build/gcd_000b11a_e/gcd_000b11a_e.shp

# regions.json: build/censusDivs.json
# 	node_modules/.bin/topojson \
# 		-o $@ \
# 		--projection='width = 960, height = 600, d3.geo.albers() \
# 			.rotate([126, -10]) \
# 		    .center([7,44]) \
# 		    .parallels([50, 58]) \
# 		    .scale(1970) \
# 		    .translate([width / 2, height / 2])' \
# 	    --properties='region=CDNAME' \
# 	    --properties='region_id=CDUID' \
# 	    --simplify=0.05 \
# 		-- regions=$<




# #working version, not bc albers		
# regions_old.json: build/regdist.json
# 	node_modules/.bin/topojson \
# 		-o $@ \
# 		--projection='width = 960, height = 600, d3.geo.albers() \
# 			.rotate([126, -10]) \
# 		    .center([7,44]) \
# 		    .parallels([50, 58]) \
# 		    .scale(1970) \
# 		    .translate([width / 2, height / 2])' \
# 	    --properties='region=AA_NAME' \
# 	    --properties='region_id=AA_ID' \
# 	    --simplify=0.05 \
# 		-- regions=$<


# pacific.json: build/ocean.json
# 	node_modules/.bin/topojson \
# 		-o $@ \
# 		--projection='width = 960, height = 600, d3.geo.albers() \
# 			.rotate([126, -10]) \
# 		    .center([7,44]) \
# 		    .parallels([50, 58]) \
# 		    .scale(1970) \
# 		    .translate([width / 2, height / 2])' \
# 	    --simplify=0.05 \
# 		-- pacific=$<

# # snow pillow locations
# build/snowp.json: build/BCGW_78757263_1449273107815_7232/SSL_SPL_SV/SSL_SPL_SV_point.shp
# 	ogr2ogr -f GeoJSON  -t_srs "+proj=latlong +datum=WGS84" \
# 	build/snowp.json \
# 	build/BCGW_78757263_1449273107815_7232/SSL_SPL_SV/SSL_SPL_SV_point.shp


# #working version, not bc albers		
# pillows.json: build/snowp.json
# 	node_modules/.bin/topojson \
# 		-o $@ \
# 		--projection='width = 960, height = 600, d3.geo.albers() \
# 			.rotate([126, -10]) \
# 		    .center([7,44]) \
# 		    .parallels([50, 58]) \
# 		    .scale(1970) \
# 		    .translate([width / 2, height / 2])' \
# 	    --properties='staNam=STATN_NAME' \
# 	    --properties='locID=SP_LOC_ID' \
# 	    --simplify=0.05 \
# 		-- pillows=$<




###################################



# Use BC Albers Projection
# build/subunits.json: build/Boundaries/CD_2011.shp
# 	ogr2ogr -f GeoJSON  -t_srs "+proj=aea +lat_1=50 +lat_2=58.5 +lat_0=45
# +lon_0=-126 +x_0=1000000 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs" \
# 	build/subunits.json \
# 	build/Boundaries/CD_2011.shp

# census.json: build/subunits.json
# 	node_modules/.bin/topojson \
# 		-o $@ \
# 	    --properties='zone=CDNAME' \
# 		-- census=$<

