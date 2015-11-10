<%@ page language="java" import="java.io.*,java.util.*,com.fiberhome.bcs.appprocess.common.util.*,sun.misc.BASE64Decoder"
 contentType="img/png; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String mailid=aa.req.getParameterFromUrl("mailid");
String filename=aa.req.getParameterFromUrl("filename");
String wsurl=(String)session.getAttribute("wsurl");
//mailid="388427";
%>


<aa:http id="oaatrcon" keepreqdata="false" method="post" url="<%=wsurl%>">

<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/getattachcontent\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:getattachcontent>
         <tlys:mailid><%=mailid%></tlys:mailid>
      </tlys:getattachcontent>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","oaatrcon").replaceAll("xmlns=\"http://www.tlys/\"", "");

%>
<aa:datasource id="oaatrconxml" wellformed="true" value="<%=strxml %>"></aa:datasource>

<%
strxml=aa.xpath("//getattachcontentResult","oaatrconxml");
BASE64Decoder decoder = new BASE64Decoder();
byte[] filearr=decoder.decodeBuffer(strxml);

//ServletOutputStream output=response.getOutputStream();
//response.setContentType("application/x-msdownload");
//output.write(filearr);
//output.close();




InputStream is = new ByteArrayInputStream(filearr);
byte data[] = new byte[is.available()];
is.read(data); // 读数据
is.close();
response.setContentType("application/octet-stream"); // 设置返回的文件类型
response.setHeader("Content-Disposition","attachment;filename="+filename);//ios必须设置该属性
OutputStream os = response.getOutputStream(); // 得到向客户端输出二进制数据的对象
os.write(data); // 输出数据
//各种关闭
os.close();
//String strxml2="134";
%>

